CREATE TABLE IF NOT EXISTS trainings(id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, exercise_id INTEGER, muscle_group_id INTEGER, series TEXT, comment TEXT);
CREATE TABLE IF NOT EXISTS muscle_groups(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, img TEXT); 
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Pecho','assets/muscle-img/pecho.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Hombro','assets/muscle-img/hombro.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Dorsales','assets/muscle-img/dorsales.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Deltoide Posterior','assets/muscle-img/deltoide-posterior.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Trapecio','assets/muscle-img/trapecio.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Lumbar','assets/muscle-img/lumbar.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Biceps','assets/muscle-img/biceps.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Triceps','assets/muscle-img/triceps.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Antebrazo','assets/muscle-img/antebrazo.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Gemelos','assets/muscle-img/gemelo.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Cuadriceps','assets/muscle-img/cuadriceps.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Femoral','assets/muscle-img/femoral.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Gluteo','assets/muscle-img/gluteo.png');
INSERT or IGNORE INTO muscle_groups(name,img) VALUES ('Abdominales','assets/muscle-img/abdominales.png');
CREATE TABLE IF NOT EXISTS exercises(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, muscle_group_id INTEGER);
/*CREATE TRIGGER IF NOT EXISTS delete_muscle_group AFTER DELETE ON muscle_groups FOR EACH ROW BEGIN DELETE FROM exercises WHERE muscle_group_id = OLD.id;DELETE FROM trainings WHERE trainings.muscle_group_id = OLD.id;END;*/