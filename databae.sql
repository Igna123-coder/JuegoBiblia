-- Estructura de Base de Datos para BibliaDuo

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    xp_total INT DEFAULT 0,
    vidas INT DEFAULT 5,
    niveles_completados INT DEFAULT 0
);

CREATE TABLE modulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    libro VARCHAR(50) DEFAULT 'Génesis'
);

CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modulo_id INT,
    pregunta TEXT NOT NULL,
    opcion_1 TEXT NOT NULL,
    opcion_2 TEXT NOT NULL,
    opcion_3 TEXT NOT NULL,
    respuesta_correcta INT NOT NULL, -- 0, 1 o 2
    FOREIGN KEY (modulo_id) REFERENCES modulos(id)
);

-- Insertar datos de prueba
INSERT INTO modulos (titulo) VALUES ('La Creación'), ('Adán y Eva');

INSERT INTO preguntas (modulo_id, pregunta, opcion_1, opcion_2, opcion_3, respuesta_correcta) VALUES
(1, 'En el principio creó Dios los cielos y la...', 'Tierra', 'Naturaleza', 'Luz', 0),
(1, '¿Qué creó Dios el primer día?', 'Los animales', 'La luz', 'El sol y la luna', 1);
