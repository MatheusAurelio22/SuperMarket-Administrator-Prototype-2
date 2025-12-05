--
-- PostgreSQL database dump
--

\restrict cqylaYlkrO1b7O78dlWyuG21gatkCKqhS4MRXR3D1azRnqNR4c0PDresJqmkvqe

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-04 22:17:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16407)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(12,2) NOT NULL,
    promo_price numeric(12,2),
    promo_expires_at date,
    type character varying(100),
    description text,
    expires_at date,
    created_at timestamp without time zone DEFAULT now(),
    image character varying(255),
    quantity integer DEFAULT 0
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16406)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password character varying(200) NOT NULL,
    cpf character varying(20) NOT NULL,
    photo character varying(500),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4863 (class 2604 OID 16410)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4861 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5022 (class 0 OID 16407)
-- Dependencies: 222
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, promo_price, promo_expires_at, type, description, expires_at, created_at, image, quantity) FROM stdin;
6	MacarrÃ£o 500g	6.20	\N	\N	Mercearia	MacarrÃ£o espaguete	2025-11-29	2025-12-03 18:40:23.605626	\N	0
4	Arroz 5kg	29.90	\N	\N	Mercearia	Arroz branco tipo 1	2025-12-30	2025-12-03 18:40:23.605626	\N	5
10	Cuscuz	1.50	\N	\N	Mercearia	Cuscuz	2025-12-31	2025-12-04 21:52:03.619696	\N	10
5	FeijÃ£o 1kg	9.50	\N	\N	Mercearia	FeijÃ£o carioca	\N	2025-12-03 18:40:23.605626	\N	0
\.


--
-- TOC entry 5020 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, cpf, photo, created_at) FROM stdin;
4	Admin	admin@admin.com	123456789	12345678900	\N	2025-12-04 14:47:57.341888
2	Matheus Aurelio	teste@gmail.com	123456789	12345678900	\N	2025-12-04 16:41:51.095257
1	Matheus AurÃ©lio	admin@teste.com	$2b$10$Hv2rZ0xrsUibJrLHuJRxOuzX2SlSnSAB2MB1p7pW1NKn09cnOF.e2	123.456.789-00	\N	2025-12-03 17:08:22.756409
\.


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 10, true);


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- TOC entry 4871 (class 2606 OID 16418)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4867 (class 2606 OID 16405)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4869 (class 2606 OID 16403)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2025-12-04 22:17:38

--
-- PostgreSQL database dump complete
--

\unrestrict cqylaYlkrO1b7O78dlWyuG21gatkCKqhS4MRXR3D1azRnqNR4c0PDresJqmkvqe

