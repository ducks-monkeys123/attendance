import { get, ref, set } from "firebase/database";
import { firebaseDB } from "../firebase/firebaseConfig";

export function writeData(userId: string, name: string, email: string) {
    console.log("realtime-database: writeData");
    set(ref(firebaseDB, userId), {
        username: name,
        email: email,
    });
}

export async function getData(userId: string) {
    console.log("realtime-database: getData");
    const snapshot = await get(ref(firebaseDB, userId));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log("No data available");
        return null;
    }
}
