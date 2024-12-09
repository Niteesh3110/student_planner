import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Note: You will need to change the code below to have the collection required by the assignment!
export const courses = getCollectionFn("courses");
export const tree = getCollectionFn("tree");
export const questions = getCollectionFn("questions");
export const event = getCollectionFn("event");
