import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';

export interface Muscle_Group {
  id: number,
  name: string,
  img: string
}
export interface Exercise {
  id: number,
  name: string,
  muscle_group_id: number,
  muscle_name: string
}

export interface Training {
  id: number,
  date: string,
  muscle_group_id: number,
  exercise_id: number,
  series: string,
  comment: string
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  private trainings$ = new BehaviorSubject([]);
  private muscle_groups$ = new BehaviorSubject([]);
  private exercises$ = new BehaviorSubject([]);

  constructor(private platform: Platform, private sqlite: SQLite, private sqlitePorter: SQLitePorter, private http: HttpClient, private utils: UtilsService) {

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'gym-progress.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          this.database = db
          this.seedDatabase()
          /* this.createTables().then(() => {
            this.dbReady.next(true);
            this.loadAll();
           
          }).catch(e => console.log('Error executing creation Tables: ' + JSON.stringify(e)));  */ 
        }).catch(e => console.log('Error executing creation SQL: ' + JSON.stringify(e)));

    });
  }

  seedDatabase() {
    this.http.get('assets/init.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.database.executeSql(`CREATE TRIGGER IF NOT EXISTS delete_muscle_group AFTER DELETE ON muscle_groups FOR EACH ROW BEGIN DELETE FROM exercises WHERE muscle_group_id = OLD.id; DELETE FROM trainings WHERE trainings.muscle_group_id = OLD.id;END;`, []);     
            this.dbReady.next(true);
            this.loadAll();
          }).catch(e => console.log('Error import Database SqlitePorter: ' + JSON.stringify(e)));
          
      });
  }
 
  
 private isReady() {
    return new Promise((resolve, reject) => {
      //if dbReady is true, resolve
      if (this.dbReady.getValue()) {
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else {
        this.dbReady.subscribe((ready) => {
          if (ready) {
            resolve();
          }
        });
      }
    })
  }

  createTables() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS trainings(id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, exercise_id INTEGER, muscle_group_id INTEGER, series TEXT, comment TEXT);`
      , [])
      .then(() => {
        return this.database.executeSql(
          `CREATE TABLE IF NOT EXISTS muscle_groups(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, img TEXT);`, [])
          .then(() => {
            return this.database.executeSql(
              `CREATE TABLE IF NOT EXISTS exercises(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, muscle_group_id INTEGER);`, [])
              .then(() => {
                return this.database.executeSql(
                  `CREATE TRIGGER delete_muscle_group AFTER DELETE ON muscle_groups FOR EACH ROW BEGIN DELETE FROM exercises WHERE muscle_group_id = OLD.id;DELETE FROM trainings WHERE trainings.muscle_group_id = OLD.id;END;`, [])
              })
          })
      })
  }

  /**
   *
   * Trainings crud
   *
   */
  loadTrainings(date: string = this.utils.formatYMD(new Date())) {
    var query = 'SELECT id, date, muscle_group_id, exercise_id, series, comment FROM trainings WHERE date = ? ORDER BY date DESC';
    this.isReady().then(() => {
      return this.database.executeSql(query, [date]).then(data => {
        let trainings: Training[] = [];
        console.log(data.rows)
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            trainings.push({
              date: data.rows.item(i).date,
              id: data.rows.item(i).id,
              muscle_group_id: data.rows.item(i).muscle_group_id,
              exercise_id: data.rows.item(i).exercise_id,
              series: data.rows.item(i).series,
              comment: data.rows.item(i).comment
            });
          }
        }

        this.trainings$.next(trainings);
      });
    });
  }

  getAllTrainings() {
    var query = 'SELECT * FROM trainings ';
    return this.isReady().then(() => {
      return this.database.executeSql(query, []).then(data => {
        let trainings: any[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            trainings.push({
              date: data.rows.item(i).date,
              id: data.rows.item(i).id,
              muscle_group_id: data.rows.item(i).muscle_group_id,
              exercise_id: data.rows.item(i).exercise_id,
              series: data.rows.item(i).series,
              comment: data.rows.item(i).comment

            });
          }
        }
        return trainings;
      });
    });
  }

  getAllDates() {
    var query = 'SELECT DISTINCT date FROM trainings';
    return this.isReady().then(() => {
      return this.database.executeSql(query, []).then(data => {
        let dates: any[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            dates.push({
              date: data.rows.item(i).date,

            });
          }
        }
        return dates;
      }).catch(e => console.log('Error executing creation SQL: ' + JSON.stringify(e)));
    });
  }

  getTrainings(): Observable<Training[]> {
    return this.trainings$.asObservable();
  }


  getTrainingsWithExercise(exercixe_id: number) {
    var query = 'SELECT id, date, muscle_group_id, exercise_id, series, comment FROM trainings WHERE exercise_id = ? ORDER BY date DESC';
    return this.isReady().then(() => {
      return this.database.executeSql(query, [exercixe_id]).then(data => {
        let trainings: Training[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            trainings.push({
              date: data.rows.item(i).date,
              id: data.rows.item(i).id,
              muscle_group_id: data.rows.item(i).muscle_group_id,
              exercise_id: data.rows.item(i).exercise_id,
              series: data.rows.item(i).series,
              comment: data.rows.item(i).comment
            });
          }
        }
        this.trainings$.next(trainings);
      }).catch(e => console.log('Error executing creation SQL: ' + JSON.stringify(e)));
    });
  }

  searchTrainingsWithExerciseAndGroup(group_id: number, exercixe_id: number): Promise<Training[]> {
    var query = 'SELECT id, date, muscle_group_id, exercise_id, series, comment FROM trainings WHERE muscle_group_id = ? AND exercise_id = ? ORDER BY date DESC';
    return this.isReady().then(() => {
      return this.database.executeSql(query, [group_id, exercixe_id]).then(data => {
        let trainings: Training[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            trainings.push({
              date: data.rows.item(i).date,
              id: data.rows.item(i).id,
              muscle_group_id: data.rows.item(i).muscle_group_id,
              exercise_id: data.rows.item(i).exercise_id,
              series: data.rows.item(i).series,
              comment: data.rows.item(i).comment
            });
          }
        }
        return trainings;
      });
    });
  }
  
  searchTrainingsWithDateRange(initDate: any, endDate: any): Promise<Training[]> {
    var query = 'SELECT id, date, muscle_group_id, exercise_id, series, comment FROM trainings WHERE DATE(date) BETWEEN ? AND ? ORDER BY date DESC';
    return this.isReady().then(() => {
      return this.database.executeSql(query, [initDate, endDate]).then(data => {
        let trainings: Training[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            trainings.push({
              date: data.rows.item(i).date,
              id: data.rows.item(i).id,
              muscle_group_id: data.rows.item(i).muscle_group_id,
              exercise_id: data.rows.item(i).exercise_id,
              series: data.rows.item(i).series,
              comment: data.rows.item(i).comment
            });
          }
        }
        return trainings;
      })
    });
  }

  /**
   *
   * Muscle Groups crud
   *
   */

  loadMuscleGroups() {
    this.isReady().then(() => {
      var query = 'SELECT * FROM muscle_groups ORDER BY name';
      return this.database.executeSql(query, []).then(data => {
        let m_gropups: Muscle_Group[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            m_gropups.push({
              name: data.rows.item(i).name,
              id: data.rows.item(i).id,
              img: data.rows.item(i).img
            });
          }
        }
        this.muscle_groups$.next(m_gropups);
      });
    });
  }

  getMuscleGroups(): Observable<Muscle_Group[]> {
    return this.muscle_groups$.asObservable();
  }


  getMuscleGroupWithId(id: number) {
    return this.isReady().then(() => {
      let query = `SELECT * FROM muscle_groups WHERE id=?`;
      return this.database.executeSql(query, [id]).then((data) => {
        if (data.rows.length > 0) {
          return data.rows.item(0);
        }
        return null;
      });
    })
  }

  /**
   *
   * Exercises crud
   *
   */

  loadExercises(muscle_g_id: number = 0) {

    this.isReady().then(() => {
      let query = `SELECT exercises.id, exercises.name, exercises.muscle_group_id, muscle_groups.name AS muscle_name FROM exercises INNER JOIN muscle_groups ON exercises.muscle_group_id = muscle_groups.id ORDER BY exercises.name`;
      if (muscle_g_id > 0) {
        query = `SELECT exercises.id, exercises.name, exercises.muscle_group_id, muscle_groups.name AS muscle_name FROM exercises INNER JOIN muscle_groups ON exercises.muscle_group_id = muscle_groups.id WHERE exercises.muscle_group_id=${muscle_g_id} ORDER BY exercises.name`;
      }

      return this.database.executeSql(query, []).then(data => {
        let exercises: Exercise[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            exercises.push({
              name: data.rows.item(i).name,
              id: data.rows.item(i).id,
              muscle_group_id: data.rows.item(i).muscle_group_id,
              muscle_name: data.rows.item(i).muscle_name
            });
          }
        }
        this.exercises$.next(exercises);
      });
    });
  }

  getExercisesWithMuscleGroup(muscle_g_id: number = 0) {

    this.isReady().then(() => {
      let query = `SELECT exercises.id, exercises.name, exercises.muscle_group_id, muscle_groups.name AS muscle_name FROM exercises INNER JOIN muscle_groups ON exercises.muscle_group_id = muscle_groups.id WHERE exercises.muscle_group_id=${muscle_g_id} ORDER BY exercises.name`;
      return this.database.executeSql(query, []).then(data => {
        let exercisesGroup: any[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            exercisesGroup.push({
              muscle: data.rows.item(i).muscle_name,
              exercises: {
                name: data.rows.item(i).name,
                id: data.rows.item(i).id,
                muscle_group_id: data.rows.item(i).muscle_group_id,
                muscle_name: data.rows.item(i).muscle_name
              }
            });
          }
        }
        return exercisesGroup;
      }).catch(e => console.log('Error executing creation SQL: ' + JSON.stringify(e)));
    });
  }

  getExerciseWithId(id: number) {
    return this.isReady().then(() => {
      var query = `SELECT exercises.id, exercises.name, exercises.muscle_group_id, muscle_groups.name AS muscle_name FROM exercises INNER JOIN muscle_groups ON exercises.muscle_group_id = muscle_groups.id  WHERE exercises.id=?`;
      return this.database.executeSql(query, [id]).then((data) => {
        if (data.rows.length > 0) {
          return data.rows.item(0);
        }
        return null;
      });
    })
  }

  getExercises(): Observable<Exercise[]> {
    return this.exercises$.asObservable();
  }



  /*=============================================
  =            General Functions for all            =
  =============================================*/

  addData(tableName: string, values: any[], date = this.utils.formatYMD(new Date())) {
    let query: string;
    switch (tableName) {
      case "trainings":
        query = `INSERT INTO trainings ( date , muscle_group_id, exercise_id, series, comment) VALUES ( ?, ?, ?, ?, ?)`;
        break;
      case "muscle_groups":
        query = `INSERT INTO muscle_groups ( name, img ) VALUES ( ?, ? )`;
        break;
      case "exercises":
        query = `INSERT INTO exercises ( name, muscle_group_id ) VALUES ( ? ,?)`;

        break;
      default:
        break;
    }

    return this.isReady().then(() => {
      return this.database.executeSql(query, values).then((data) => {
        this.reloadData(tableName, date);
      });
    });
  }

  updateData(tableName: string, values: any[], date: string = this.utils.formatYMD(new Date())) {
    let query: string;

    switch (tableName) {
      case "trainings":
        query = `UPDATE trainings SET date = ?, muscle_group_id = ?, exercise_id= ?, series= ?, comment= ? WHERE id = ?`;
        break;
      case "muscle_groups":
        query = `UPDATE muscle_groups SET name = ?, img = ? WHERE id = ?`;
        break;
      case "exercises":
        query = `UPDATE exercises SET name = ?, muscle_group_id = ? WHERE id = ?`;

        break;
      default:
        break;
    }
    return this.isReady().then(() => {
      return this.database.executeSql(query, values).then((data) => {
        this.reloadData(tableName, date);
      });
    })
  }

  deleteData(tableName: string, id: number, date = this.utils.formatYMD(new Date())) {
    return this.isReady().then(() => {
      let query = `DELETE FROM ${tableName} WHERE id = ?`;
      return this.database.executeSql(query, [id]).then((data) => {
        
        this.reloadData(tableName, date);
      });
    })
  }

  reloadData(tableName: string, date: string = this.utils.formatYMD(new Date())) {
    switch (tableName) {
      case "trainings":
        this.loadTrainings(date);
        break;
      case "muscle_groups":
        this.loadMuscleGroups();
        break;
      case "exercises":
        this.loadExercises();
        break;
      default:
        break;
    }
  }

  loadAll() {
    this.loadTrainings();
    this.loadMuscleGroups();
    this.loadExercises();
  }

  closeDatabase() {
    this.database.close();
  }

}
