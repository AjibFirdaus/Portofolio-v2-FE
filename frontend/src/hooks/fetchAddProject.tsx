import { useState } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

interface ProjectData {
  title: string;
  description: string;
  link: string;
  image: string;
}

const useAddProject = () => {
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const token = localStorage.getItem("token");

  const addProject = async (newProject: ProjectData) => {
    setAdding(true);
    setAddError('');
    try {
      await axios.post(`${config}/api-create/addProject`, { data: newProject }, { headers: { Authorization: token } });
    } catch (error) {
      if (error instanceof Error) {
        setAddError(error.message);
      } else {
        setAddError('An unknown error occurred');
      }
    } finally {
      setAdding(false);
    }
  };

  return { addProject, adding, addError };
};

export default useAddProject;