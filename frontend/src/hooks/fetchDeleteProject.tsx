import { useState } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

const useDeleteProject = () => {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const token = localStorage.getItem("token");

  const deleteProject = async (projectId: string) => {
    setDeleting(true);
    setDeleteError('');
    try {
      await axios.delete(`${config}/api-delete/project/${projectId}`, {
        headers: { Authorization: token }
      });
    } catch (error) {
      if (error instanceof Error) {
        setDeleteError(error.message);
      } else {
        setDeleteError('An unknown error occurred');
      }
    } finally {
      setDeleting(false);
    }
  };

  return { deleteProject, deleting, deleteError };
};

export default useDeleteProject;