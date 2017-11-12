/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebase from "firebase";
import Transaction = firebase.firestore.Transaction;
admin.initializeApp(functions.config().firebase);

export function get(path: string): Promise<any | null> {
    return new admin.firestore.Firestore().doc(path).get().then((document: any) => {
        return document.exists ? document.data() : null;
    });
}

export function set(path: string, value: any): Promise<any> {
    return new admin.firestore.Firestore().doc(path).set(value)
}

export function remove(path: string): Promise<any> {
    return new admin.firestore.Firestore().doc(path).delete();
}

export async function transaction(path: string, callback): Promise<any> {
    const db = new admin.firestore.Firestore();
    const ref = db.doc(path);
    const doc = await ref.get();
    const data = doc.exists ? doc.data() : null;
    return db.runTransaction(async (tran: any) => {
        const newData = await callback(data);
        if (data) {
            tran.update(ref, newData);
        } else {
            tran.set(ref, newData);
        }
        Promise.resolve();
    });
}
