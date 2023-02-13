
CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    department VARCHAR(100),
    subject VARCHAR(100),
    password VARCHAR(65)
);


CREATE TABLE meetings (
    ID SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL, 
    tutorID INT,
    studentID INT,
    status VARCHAR(20),
    FOREIGN KEY (tutorID) REFERENCES users(id),
    FOREIGN KEY (studentID) REFERENCES users(id)
);



CREATE TABLE tutorrequest (
    ID SERIAL PRIMARY KEY,
    subject VARCHAR(100),
    department VARCHAR(100),
    status VARCHAR(20),
    requesterID INT,
    FOREIGN KEY (requesterID) REFERENCES users(id)
);


CREATE TABLE reviews (
    ID SERIAL PRIMARY KEY,
    reviewerid INT NOT NULL,
    tutorid INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutorID) REFERENCES users(id),
    FOREIGN KEY (reviewerid) REFERENCES users(id)
);
