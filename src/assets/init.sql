CREATE TABLE IF NOT EXISTS trainings(id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, exercise_id INTEGER, muscle_group_id INTEGER, series TEXT, comment TEXT);
CREATE TABLE IF NOT EXISTS muscle_groups(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, img TEXT); 
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Pecho','assets/pecho.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Hombro','assets/hombro.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Dorsales','assets/dorsales.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Deltoide Posterior','assets/deltoide-posterior.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Trapecio','assets/trapecio.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Lumbar','assets/lumbar.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Biceps','assets/biceps.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Triceps','assets/triceps.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Antebrazo','assets/antebrazo.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Gemelos','assets/gemelo.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Cuadriceps','assets/cuadriceps.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Femoral','assets/femoral.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Gluteo','assets/gluteo.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Abdominales','assets/abdominales.png');
CREATE TABLE IF NOT EXISTS exercises(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, muscle_group_id INTEGER);
/*CREATE TRIGGER IF NOT EXISTS delete_muscle_group AFTER DELETE ON muscle_groups FOR EACH ROW BEGIN DELETE FROM exercises WHERE muscle_group_id = OLD.id;DELETE FROM trainings WHERE trainings.muscle_group_id = OLD.id;END;*/