CREATE TABLE users (
    UserId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    Role VARCHAR(20) NOT NULL DEFAULT 'user',
    AvatarUrl TEXT
);
