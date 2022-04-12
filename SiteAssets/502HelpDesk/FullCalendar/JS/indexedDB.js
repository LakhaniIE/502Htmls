function IndexedDBModule() {
    let IndexedDb;
    let IndexedDBRequest;

    this.initIndexedDb = (IndexedDbName, IndexedDBVersion, IndexedDBObjStores, IndexedDBConnection) => {
        if (window.indexedDB) {
            IndexedDBRequest = window.indexedDB.open(IndexedDbName, IndexedDBVersion);
            IndexedDBRequest.onupgradeneeded = (e) => {
                IndexedDb = e.target.result;
                IndexedDBObjStores.forEach((storeName) => {
                    // Creates object store for DB(if upgrade needed/store doesn't exists).
                    if (IndexedDb.objectStoreNames.contains(storeName)) {
                        IndexedDb.deleteObjectStore(storeName);
                    }
                    IndexedDb.createObjectStore(storeName);
                });
            };
            IndexedDBRequest.onsuccess = (e) => {
                IndexedDb = e.target.result;
                console.log(`${IndexedDbName} IndexedDB initialized with input object stores:`, IndexedDBObjStores, e);
                IndexedDBConnection.resolve(true);
            };
            IndexedDBRequest.onerror = (e) => {
                console.log(`${IndexedDbName} IndexedDB Error:`, IndexedDBObjStores, e);
                IndexedDBConnection.reject(e);
            };
        } else {
            IndexedDBConnection.reject();
        }
    }

    this.storeDataInIndexedDb = (Data, objectStoreName) => {
        return new Promise((resolve, reject) => {
            let getIndexDBDataTransaction = IndexedDb.transaction(objectStoreName, "readwrite");
            getIndexDBDataTransaction.oncomplete = (event) => {
                console.log(`${objectStoreName}: STORE IndexedDB Data Transaction success!`, event);
                resolve();
            };
            getIndexDBDataTransaction.onerror = (event) => {
                console.log(`${objectStoreName}: STORE IndexedDB Data Transaction failed!`, event);
                reject();
            };
            let objectStore = getIndexDBDataTransaction.objectStore(objectStoreName);
            let objectStoreClear = objectStore.clear();
            objectStoreClear.onsuccess = (event) => {
                Data.forEach((value) => {
                    let request = objectStore.put(value, value.ID);
                    request.onsuccess = (event) => {
                        // console.log(`Item_ID: ${value.ID} Added to IndexedDB`, event);
                    };
                });
            };
        });
    }

    this.getIndexedDBData = (objectStoreName) => {
        return new Promise((resolve, reject) => {
            let getIndexDBUserDataTransaction = IndexedDb.transaction(objectStoreName, "readonly");
            let sortedData = [];
            getIndexDBUserDataTransaction.oncomplete = (event) => {
                console.log(`${objectStoreName}: GET IndexedDB Data Transaction success!,`, event);
                resolve(sortedData);
            };
            getIndexDBUserDataTransaction.onerror = (event) => {
                console.log(`${objectStoreName}: GET IndexedDB Data Transaction failed!,`, event);
                reject();
            };
            let objectStore = getIndexDBUserDataTransaction.objectStore(objectStoreName);
            objectStore.getAll().onsuccess = (event) => {
                if (event.target.result && event.target.result.length > 0) {
                    sortedData = event.target.result.sort((a, b) => {
                        return new Date(b.Modified) - new Date(a.Modified);
                    });
                }
            };
            objectStore.getAll().onerror = (e) => {
                console.error(e);
                reject(e);
            };
        });
    }
}