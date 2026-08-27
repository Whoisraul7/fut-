
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Jogador',
  email text,
  avatar_url text,
  city text,
  bio text,
  position text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.courts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'publica' CHECK (kind IN ('publica','privada')),
  surface text NOT NULL DEFAULT 'society' CHECK (surface IN ('society','futsal','grama','areia')),
  address text,
  district text,
  city text NOT NULL,
  state text,
  latitude double precision,
  longitude double precision,
  photo_url text,
  rating numeric(2,1),
  price_info text,
  opening_hours text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courts TO anon;
GRANT SELECT ON public.courts TO authenticated;
GRANT ALL ON public.courts TO service_role;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courts_public_read" ON public.courts FOR SELECT USING (true);

CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  court_id uuid REFERENCES public.courts(id) ON DELETE SET NULL,
  title text NOT NULL,
  match_date date NOT NULL,
  match_time time NOT NULL,
  max_players int NOT NULL DEFAULT 10 CHECK (max_players BETWEEN 2 AND 50),
  football_type text NOT NULL DEFAULT 'society' CHECK (football_type IN ('society','futsal','campo','areia')),
  level text NOT NULL DEFAULT 'iniciante' CHECK (level IN ('iniciante','intermediario','avancado')),
  description text,
  status text NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta','cheia','cancelada','encerrada')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.matches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO authenticated;
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_public_read" ON public.matches FOR SELECT USING (true);
CREATE POLICY "matches_insert_own" ON public.matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "matches_update_own" ON public.matches FOR UPDATE TO authenticated USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "matches_delete_own" ON public.matches FOR DELETE TO authenticated USING (auth.uid() = creator_id);

CREATE TABLE public.match_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, user_id)
);
GRANT SELECT ON public.match_participants TO anon;
GRANT SELECT, INSERT, DELETE ON public.match_participants TO authenticated;
GRANT ALL ON public.match_participants TO service_role;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participants_public_read" ON public.match_participants FOR SELECT USING (true);
CREATE POLICY "participants_insert_own" ON public.match_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "participants_delete_own" ON public.match_participants FOR DELETE TO authenticated USING (auth.uid() = user_id OR auth.uid() = (SELECT creator_id FROM public.matches m WHERE m.id = match_id));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER matches_set_updated_at BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, city, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'city',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.courts (name, kind, surface, address, district, city, state, latitude, longitude, photo_url, rating, price_info, opening_hours) VALUES
('Arena Central Society','privada','society','Av. Paulista, 1200','Bela Vista','São Paulo','SP',-23.5615,-46.6559,'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=900&q=70',4.7,'R$ 180/hora','06:00 - 23:00'),
('Quadra do Parque Ibirapuera','publica','futsal','Av. Pedro Álvares Cabral, s/n','Ibirapuera','São Paulo','SP',-23.5874,-46.6576,'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=900&q=70',4.3,'Gratuito','05:00 - 22:00'),
('Society Vila Madalena','privada','grama','Rua Aspicuelta, 340','Vila Madalena','São Paulo','SP',-23.5546,-46.6907,'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=70',4.5,'R$ 150/hora','07:00 - 00:00'),
('Areninha Zona Leste','publica','areia','Rua Guaiaúna, 500','Penha','São Paulo','SP',-23.5316,-46.5423,'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=900&q=70',4.0,'Gratuito','06:00 - 21:00'),
('Complexo Esportivo Butantã','publica','society','Av. Vital Brasil, 900','Butantã','São Paulo','SP',-23.5698,-46.7098,'https://images.unsplash.com/photo-1600679472829-3044539ce8ed?auto=format&fit=crop&w=900&q=70',4.1,'Gratuito','06:00 - 22:00'),
('Arena Beira-Mar','privada','areia','Av. Atlântica, 2000','Copacabana','Rio de Janeiro','RJ',-22.9711,-43.1822,'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=900&q=70',4.8,'R$ 120/hora','06:00 - 23:00'),
('Futsal Tijuca Club','privada','futsal','Rua Conde de Bonfim, 700','Tijuca','Rio de Janeiro','RJ',-22.9245,-43.2333,'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=900&q=70',4.4,'R$ 90/hora','08:00 - 23:00'),
('Campo do Bairro Savassi','publica','grama','Rua Pernambuco, 1500','Savassi','Belo Horizonte','MG',-19.9386,-43.9345,'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=70',3.9,'Gratuito','06:00 - 20:00'),
('Arena Norte Society','privada','society','Av. Antônio Carlos, 2200','Pampulha','Belo Horizonte','MG',-19.8659,-43.9642,'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=900&q=70',4.6,'R$ 160/hora','07:00 - 23:30'),
('Quadra Municipal Boa Viagem','publica','futsal','Av. Boa Viagem, 100','Boa Viagem','Recife','PE',-8.1191,-34.8975,'https://images.unsplash.com/photo-1610704027385-04ec2a5c15d4?auto=format&fit=crop&w=900&q=70',4.2,'Gratuito','05:30 - 22:00'),
('Society Barra Sul','privada','grama','Av. das Américas, 5000','Barra da Tijuca','Rio de Janeiro','RJ',-23.0031,-43.3655,'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=70',4.5,'R$ 200/hora','06:00 - 00:00'),
('Arena Sul Porto Alegre','privada','society','Av. Ipiranga, 6600','Partenon','Porto Alegre','RS',-30.0596,-51.1740,'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?auto=format&fit=crop&w=900&q=70',4.3,'R$ 140/hora','07:00 - 23:00');
