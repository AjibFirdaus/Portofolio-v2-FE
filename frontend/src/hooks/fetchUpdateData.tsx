/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';


// interface HomeData {
//     name: string;
//     description: string;
//     description2: string;
//     nameWebsite: string;
//     link: string;
// }

// interface AboutData {
//     photo: string; // URL to the photo
//     description: string;
//     description2: string;
// }

// interface ProjectData {
//     projects: Array<{
//         title: string;
//         description: string;
//         link: string;
//         image: string; // URL to the image
//     }>;
// }

// interface ContactData {
//     contactInformation: {
//         email: string;
//         telephone: string;
//         location: string;
//     };
//     followMe: {
//         X: string;
//         github: string;
//         instagram: string;
//     };
// }

// type PageData = HomeData | AboutData | ProjectData | ContactData;

// type PageType = 'home' | 'about' | 'projects' | 'contact';

const useUpdateData = (page: any) => {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const token = localStorage.getItem("token");

  const updateData = async (updatedData: any) => {
    setUpdating(true);
    setUpdateError('');
    try {
      await axios.put(`${config}/api-update/${page}`, { data: updatedData }, { headers: { Authorization: token }, 
        maxContentLength: 50 * 1024 * 1024,
        maxBodyLength: 50 * 1024 * 1024, 
      });
    } catch (error) {
      if (error instanceof Error) {
        setUpdateError(error.message);
      } else {
        setUpdateError('An unknown error occurred');
      }
    } finally {
      setUpdating(false);
    }
  };

  return { updateData, updating, updateError };
};

export default useUpdateData;