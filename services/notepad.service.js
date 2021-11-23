import firebase from "../firebase";

const db = firebase.ref("/notepads");

class NotepadDataService {
  getAll() {
    return db;
  }

  create(notepad) {
    return db.push(notepad);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new NotepadDataService();