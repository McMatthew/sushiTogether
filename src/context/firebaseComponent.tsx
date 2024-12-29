import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
  AuthProvider,
  DatabaseProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
} from "reactfire";

const FirebaseDbProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const app = useFirebaseApp();
  const database = getDatabase(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  const firestore = getFirestore(app);

  //   if (process.env.NODE_ENV !== "production") {
  //     connectDatabaseEmulator(database, "localhost", 9000);
  //     connectAuthEmulator(auth, "http://localhost:9099");
  //   }

  return (
    <AuthProvider sdk={auth}>
      <StorageProvider sdk={storage}>
        <FirestoreProvider sdk={firestore}>
          <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
        </FirestoreProvider>
      </StorageProvider>
    </AuthProvider>
  );
};

export default FirebaseDbProvider;
