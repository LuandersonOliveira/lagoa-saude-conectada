-- ===== Enums =====
create type public.app_role as enum ('admin', 'atendente', 'paciente');
create type public.user_status as enum ('pendente', 'ativo', 'inativo');
create type public.zona_tipo as enum ('urbana', 'rural');
create type public.prioridade_legal as enum ('idoso', 'pcd', 'gestante', 'lactante');
create type public.agendamento_tipo as enum ('consulta', 'exame');
create type public.agendamento_status as enum ('agendado', 'confirmado', 'reagendado', 'em_atendimento', 'concluido', 'cancelado');
create type public.transporte_status as enum ('solicitado', 'aprovado', 'negado', 'concluido');
create type public.alerta_nivel as enum ('atencao', 'alto', 'critico');
create type public.fila_status as enum ('aguardando', 'em_atendimento', 'atendido', 'ausente');

-- ===== Bairros =====
create table public.bairros (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  zona public.zona_tipo not null default 'urbana'
);
grant select on public.bairros to anon, authenticated;
grant all on public.bairros to service_role;
alter table public.bairros enable row level security;
create policy "Bairros são públicos" on public.bairros for select to anon, authenticated using (true);

insert into public.bairros (nome, zona) values
  ('Centro', 'urbana'), ('Vila Nova', 'urbana'), ('Boa Vista', 'urbana'), ('Alto do Cruzeiro', 'urbana'),
  ('Cohab', 'urbana'), ('São José', 'urbana'), ('Bela Vista', 'urbana'), ('Loteamento Novo Horizonte', 'urbana'),
  ('Sítio Água Branca', 'rural'), ('Sítio Boa Sorte', 'rural'), ('Engenho Camorim', 'rural'),
  ('Sítio Cajueiro', 'rural'), ('Sítio Lagoa do Mel', 'rural'), ('Engenho Bonito', 'rural');

-- ===== Unidades de saúde =====
create table public.unidades_saude (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'UBS',
  endereco text,
  bairro_id uuid references public.bairros(id),
  telefone text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.unidades_saude to authenticated;
grant all on public.unidades_saude to service_role;
alter table public.unidades_saude enable row level security;

insert into public.unidades_saude (nome, tipo, endereco, bairro_id) values
  ('UBS Centro', 'UBS', 'Rua da Matriz, 120', (select id from public.bairros where nome='Centro')),
  ('UBS Vila Nova', 'UBS', 'Av. Principal, 45', (select id from public.bairros where nome='Vila Nova')),
  ('Policlínica Municipal', 'Policlínica', 'Rua do Comércio, 300', (select id from public.bairros where nome='Centro')),
  ('Laboratório Municipal', 'Laboratório', 'Rua do Comércio, 310', (select id from public.bairros where nome='Centro')),
  ('Posto de Saúde Rural Água Branca', 'PSF', 'Estrada Água Branca, km 4', (select id from public.bairros where nome='Sítio Água Branca'));

-- ===== Profiles =====
create table public.profiles (
  id uuid primary key,
  nome_civil text not null,
  nome_social text,
  cpf text not null unique,
  cns text,
  rg text,
  data_nascimento date not null,
  genero text not null,
  raca_cor text not null,
  telefone text,
  email text,
  responsavel_nome text,
  prioridades public.prioridade_legal[] not null default '{}',
  cep text,
  logradouro text,
  numero text,
  complemento text,
  bairro_id uuid references public.bairros(id),
  zona public.zona_tipo not null default 'urbana',
  ponto_referencia text,
  status public.user_status not null default 'ativo',
  status_motivo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- ===== Roles =====
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select, insert, update, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','atendente'))
$$;

create or replace function public.is_active(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = _user_id and status = 'ativo')
$$;

-- Roles policies
create policy "Usuário vê seus papéis" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "Admin vê todos os papéis" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin gerencia papéis" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
create policy "Usuário vê seu perfil" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Equipe vê perfis" on public.profiles for select to authenticated using (public.is_staff(auth.uid()));
create policy "Usuário atualiza seu perfil" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and status = (select p.status from public.profiles p where p.id = auth.uid()));
create policy "Admin atualiza perfis" on public.profiles for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Unidades policies
create policy "Unidades visíveis a autenticados" on public.unidades_saude for select to authenticated using (true);
create policy "Admin gerencia unidades" on public.unidades_saude for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ===== Trigger: novo usuário =====
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  tipo text := coalesce(m->>'tipo_conta', 'paciente');
  papel public.app_role;
  st public.user_status := 'ativo';
  prios public.prioridade_legal[] := '{}';
  nasc date;
  admin_exists boolean;
begin
  if tipo not in ('paciente','atendente','admin') then tipo := 'paciente'; end if;
  papel := tipo::public.app_role;
  nasc := coalesce((m->>'data_nascimento')::date, current_date);

  if m ? 'prioridades' and jsonb_typeof(m->'prioridades') = 'array' then
    select coalesce(array_agg(x::public.prioridade_legal), '{}') into prios
    from jsonb_array_elements_text(m->'prioridades') x
    where x in ('idoso','pcd','gestante','lactante');
  end if;
  if date_part('year', age(nasc)) >= 60 and not ('idoso' = any(prios)) then
    prios := array_append(prios, 'idoso');
  end if;

  if papel in ('atendente','admin') then
    st := 'pendente';
    if papel = 'admin' then
      select exists(select 1 from public.user_roles where role = 'admin') into admin_exists;
      if not admin_exists then st := 'ativo'; end if;
    end if;
  end if;

  insert into public.profiles (id, nome_civil, nome_social, cpf, cns, rg, data_nascimento, genero, raca_cor, telefone, email,
    responsavel_nome, prioridades, cep, logradouro, numero, complemento, bairro_id, zona, ponto_referencia, status)
  values (
    new.id,
    coalesce(m->>'nome_civil', 'Sem nome'),
    nullif(m->>'nome_social',''),
    coalesce(regexp_replace(m->>'cpf', '\D', '', 'g'), new.id::text),
    nullif(regexp_replace(coalesce(m->>'cns',''), '\D', '', 'g'),''),
    nullif(m->>'rg',''),
    nasc,
    coalesce(m->>'genero','nao_informado'),
    coalesce(m->>'raca_cor','sem_informacao'),
    nullif(regexp_replace(coalesce(m->>'telefone',''), '\D', '', 'g'),''),
    new.email,
    nullif(m->>'responsavel_nome',''),
    prios,
    nullif(regexp_replace(coalesce(m->>'cep',''), '\D', '', 'g'),''),
    nullif(m->>'logradouro',''),
    nullif(m->>'numero',''),
    nullif(m->>'complemento',''),
    nullif(m->>'bairro_id','')::uuid,
    coalesce(nullif(m->>'zona','')::public.zona_tipo, 'urbana'),
    nullif(m->>'ponto_referencia',''),
    st
  );
  insert into public.user_roles (user_id, role) values (new.id, papel);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

-- ===== Agendamentos =====
create table public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.profiles(id) on delete cascade,
  tipo public.agendamento_tipo not null,
  servico text not null,
  servico_outro text,
  unidade_id uuid references public.unidades_saude(id),
  data_hora timestamptz not null,
  status public.agendamento_status not null default 'agendado',
  observacoes text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.agendamentos to authenticated;
grant all on public.agendamentos to service_role;
alter table public.agendamentos enable row level security;
create trigger agendamentos_updated_at before update on public.agendamentos for each row execute function public.set_updated_at();

create policy "Paciente vê seus agendamentos" on public.agendamentos for select to authenticated using (paciente_id = auth.uid());
create policy "Paciente cria agendamentos" on public.agendamentos for insert to authenticated with check (paciente_id = auth.uid() and public.is_active(auth.uid()));
create policy "Paciente cancela seus agendamentos" on public.agendamentos for update to authenticated using (paciente_id = auth.uid()) with check (paciente_id = auth.uid());
create policy "Equipe gerencia agendamentos" on public.agendamentos for all to authenticated using (public.is_staff(auth.uid()) and public.is_active(auth.uid())) with check (public.is_staff(auth.uid()) and public.is_active(auth.uid()));

-- ===== Transporte sanitário =====
create table public.transportes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.profiles(id) on delete cascade,
  destino_cidade text not null,
  destino_unidade text not null,
  motivo text not null,
  data_hora timestamptz not null,
  acompanhante boolean not null default false,
  status public.transporte_status not null default 'solicitado',
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.transportes to authenticated;
grant all on public.transportes to service_role;
alter table public.transportes enable row level security;
create trigger transportes_updated_at before update on public.transportes for each row execute function public.set_updated_at();

create policy "Paciente vê seus transportes" on public.transportes for select to authenticated using (paciente_id = auth.uid());
create policy "Paciente solicita transporte" on public.transportes for insert to authenticated with check (paciente_id = auth.uid() and public.is_active(auth.uid()));
create policy "Equipe gerencia transportes" on public.transportes for all to authenticated using (public.is_staff(auth.uid()) and public.is_active(auth.uid())) with check (public.is_staff(auth.uid()) and public.is_active(auth.uid()));

-- ===== Alertas =====
create table public.alertas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  doenca text not null,
  descricao text not null,
  nivel public.alerta_nivel not null default 'atencao',
  bairro_id uuid references public.bairros(id),
  zona public.zona_tipo,
  ativo boolean not null default true,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.alertas to authenticated;
grant all on public.alertas to service_role;
alter table public.alertas enable row level security;
create policy "Alertas ativos visíveis a autenticados" on public.alertas for select to authenticated using (ativo = true or public.has_role(auth.uid(), 'admin'));
create policy "Admin gerencia alertas" on public.alertas for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.alertas (titulo, doenca, descricao, nivel, bairro_id) values
  ('Dengue — foco confirmado', 'Dengue', 'Elimine água parada. Procure a UBS em caso de febre alta e dor atrás dos olhos.', 'critico', (select id from public.bairros where nome='Centro')),
  ('Leptospirose após alagamento', 'Leptospirose', 'Evite contato com água de enchente. Use botas e luvas na limpeza.', 'alto', (select id from public.bairros where nome='Vila Nova')),
  ('Casos de gripe em alta', 'Influenza', 'Mantenha a carteira de vacinação em dia e evite aglomerações.', 'atencao', null);

-- ===== Fila de atendimento =====
create table public.fila_atendimento (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.profiles(id) on delete cascade,
  unidade_id uuid references public.unidades_saude(id),
  agendamento_id uuid references public.agendamentos(id) on delete set null,
  prioridade public.prioridade_legal,
  status public.fila_status not null default 'aguardando',
  atendente_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.fila_atendimento to authenticated;
grant all on public.fila_atendimento to service_role;
alter table public.fila_atendimento enable row level security;
create trigger fila_updated_at before update on public.fila_atendimento for each row execute function public.set_updated_at();
create policy "Paciente vê sua posição" on public.fila_atendimento for select to authenticated using (paciente_id = auth.uid());
create policy "Equipe gerencia fila" on public.fila_atendimento for all to authenticated using (public.is_staff(auth.uid()) and public.is_active(auth.uid())) with check (public.is_staff(auth.uid()) and public.is_active(auth.uid()));

-- ===== Audit log =====
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  acao text not null,
  entidade text not null,
  entidade_id text,
  detalhes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select, insert on public.audit_log to authenticated;
grant all on public.audit_log to service_role;
alter table public.audit_log enable row level security;
create policy "Admin lê auditoria" on public.audit_log for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Equipe registra auditoria" on public.audit_log for insert to authenticated with check (actor_id = auth.uid() and public.is_staff(auth.uid()));

create index agendamentos_paciente_idx on public.agendamentos(paciente_id, data_hora);
create index transportes_paciente_idx on public.transportes(paciente_id, data_hora);
create index fila_status_idx on public.fila_atendimento(status, created_at);
create index audit_created_idx on public.audit_log(created_at desc);
create index profiles_cpf_idx on public.profiles(cpf);
create index profiles_nome_idx on public.profiles(lower(nome_civil));