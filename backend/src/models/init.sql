-- Drop tables if they exist
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS alternatives;
DROP TABLE IF EXISTS criteria;
DROP TABLE IF EXISTS history_results;
DROP TABLE IF EXISTS users;

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE criteria (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('Benefit', 'Cost')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alternatives (
    id SERIAL PRIMARY KEY,
    nik VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    alternative_id INTEGER REFERENCES alternatives(id) ON DELETE CASCADE,
    criteria_id INTEGER REFERENCES criteria(id) ON DELETE CASCADE,
    value NUMERIC(10, 2) NOT NULL,
    UNIQUE(alternative_id, criteria_id)
);

CREATE TABLE history_results (
    id SERIAL PRIMARY KEY,
    batch_name VARCHAR(100) NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Criteria
INSERT INTO criteria (code, name, weight, type) VALUES
('C1', 'Pendapatan Keluarga', 30, 'Cost'),
('C2', 'Jumlah Tanggungan', 20, 'Benefit'),
('C3', 'Kondisi Rumah', 20, 'Benefit'),
('C4', 'Jenis Pekerjaan', 15, 'Benefit'),
('C5', 'Kepemilikan Aset', 15, 'Cost');

-- Insert Dummy Alternatives
INSERT INTO alternatives (nik, name, address) VALUES
('3201010001', 'Budi Santoso', 'Jl. Merdeka No 1'),
('3201010002', 'Siti Aminah', 'Jl. Merdeka No 2'),
('3201010003', 'Agus Setiawan', 'Jl. Merdeka No 3');

-- Insert Dummy Evaluations
-- Budi
INSERT INTO evaluations (alternative_id, criteria_id, value) VALUES
(1, 1, 1500000), (1, 2, 4), (1, 3, 2), (1, 4, 2), (1, 5, 5000000);
-- Siti
INSERT INTO evaluations (alternative_id, criteria_id, value) VALUES
(2, 1, 800000), (2, 2, 2), (2, 3, 1), (2, 4, 1), (2, 5, 1000000);
-- Agus
INSERT INTO evaluations (alternative_id, criteria_id, value) VALUES
(3, 1, 2500000), (3, 2, 5), (3, 3, 3), (3, 4, 4), (3, 5, 15000000);
