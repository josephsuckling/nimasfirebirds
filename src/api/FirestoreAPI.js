import { firestore } from "../FirebaseConfig";
import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  setDoc,
  getDocFromServer,
  runTransaction
} from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";


const userRef = collection(firestore, "users");
const storage = getStorage();


export const getCurrentUser = (setCurrentUser) => {
  let currId = localStorage.getItem("userID");
  //this looks up the user collection, and returns the document that matches the current userID
  onSnapshot(userRef, (response) => {
      setCurrentUser(
        response.docs.map((docs) => {
          return { ...docs.data()};
        }).filter((item) => {
          return item.userID === currId;
        })[0]
      );
  });
};


/**
 * Fetches all auto parts from Firestore.
 * @returns {Promise<Object[]>} An array of auto part data.
 */
export const fetchAutoParts = async () => {
    const partsCollectionRef = collection(firestore, "autoParts");
    try {
        const snapshot = await getDocs(partsCollectionRef);
        const partsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Auto parts fetched successfully.");
        return partsList;
    } catch (error) {
        console.error("Error fetching auto parts: ", error);
        throw new Error("Failed to fetch auto parts.");
    }
};

/**
 * Uploads images to Firebase Storage and returns their URLs.
 * @param {File[]} images Array of image files to upload.
 * @returns {Promise<string[]>} Array of URLs of the uploaded images.
 */
async function uploadImages(images) {
    const uploadPromises = images.map((image, index) => {
      const imageRef = ref(storage, `autoParts/${Date.now()}_${index}_${image.name}`);
      return uploadBytes(imageRef, image).then(() => getDownloadURL(imageRef));
    });
    return Promise.all(uploadPromises);
  }

  
  
  /**
   * Stores auto part data in Firestore, including uploaded image URLs.
   * @param {Object} partData Object containing all form data except images.
   * @param {File[]} images Array of image files.
   */
  export const saveAutoPart = async (partData, images) => {
    try {
      // First, upload images and get their URLs
      const imageUrls = await uploadImages(images);
      
       console.log("lmao")

      // Then, add a new document with part data and image URLs in Firestore
      const docRef = await addDoc(collection(firestore, "autoParts"), {
        ...partData,
        imageUrls
      });
  
      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // Optionally return the document ID
    } catch (error) {
      console.error("Error adding document: ", error);
      throw new Error("Failed to save the auto part.");
    }
  };



export const incrementLoginAttempts = async (userId) => {
    const userDocRef = doc(firestore, "loginAttempts", userId);
  
    try {
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        const currentAttempts = userDoc.data()?.attempts || 0;
        transaction.set(userDocRef, { attempts: currentAttempts + 1 }, { merge: true });
      });
      console.log("Login attempts incremented successfully.");
    } catch (error) {
      console.error("Error incrementing login attempts: ", error);
    }
  };

  // Add a new category
export const addCategory = async (categoryName) => {
    try {
        const docRef = await addDoc(collection(firestore, "categories"), { name: categoryName });
        console.log("Category added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding category:", error);
        throw new Error("Failed to add category.");
    }
};

// Get all categories
export const getCategories = async () => {
    try {
        const snapshot = await getDocs(collection(firestore, "categories"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories.");
    }
};

// Update a category
export const updateCategory = async (categoryId, newName) => {
    try {
        const docRef = doc(firestore, "categories", categoryId);
        await updateDoc(docRef, { name: newName });
        console.log("Category updated.");
    } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category.");
    }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
    try {
        const docRef = doc(firestore, "categories", categoryId);
        await deleteDoc(docRef);
        console.log("Category deleted.");
    } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error("Failed to delete category.");
    }
};

// Fetch all shipping partners
export const fetchShippingPartners = async () => {
    const querySnapshot = await getDocs(collection(firestore, "shippingPartners"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  
  // Add a new shipping partner
  export const addShippingPartner = async (partnerData) => {
    const docRef = await addDoc(collection(firestore, "shippingPartners"), partnerData);
    return docRef.id;
  };
  
  // Update a shipping partner
  export const updateShippingPartner = async (id, partnerData) => {
    const docRef = doc(firestore, "shippingPartners", id);
    await updateDoc(docRef, partnerData);
  };
  
  // Delete a shipping partner
  export const deleteShippingPartner = async (id) => {
    const docRef = doc(firestore, "shippingPartners", id);
    await deleteDoc(docRef);
  };

// Fetch user details
export const fetchUserDetails = async (userID) => {
    try {
      const userDocRef = doc(firestore, "users", userID);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw new Error("Failed to fetch user details.");
    }
  };
  
  // Update user details
  export const updateUserDetails = async (userID, userDetails) => {
    try {
      const userDocRef = doc(firestore, "users", userID);
      await setDoc(userDocRef, userDetails, { merge: true });
      console.log("User details updated.");
    } catch (error) {
      console.error("Error updating user details:", error);
      throw new Error("Failed to update user details.");
    }
  };