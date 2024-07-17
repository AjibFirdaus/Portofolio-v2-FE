import React, { useState, useRef } from 'react';
import useFetchData from '../hooks/fetchData';
import useUpdateData from '../hooks/fetchUpdateData';
import useCheckLogin from '../hooks/fetchCheckLogin';
import useAddProject from '../hooks/fetchAddProject';
import useDeleteProject from '../hooks/fetchDeleteProject';
import Modal from '../components/modal';

const Projects: React.FC = () => {
  const { data, loading, error } = useFetchData('projects');
  const { isLoggedIn, checkingLogin } = useCheckLogin();
  const { updateData, updating, updateError } = useUpdateData('projects');
  const { deleteProject, deleting, deleteError } = useDeleteProject();
  const { addProject, adding, addError } = useAddProject();
  const [editing, setEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedProject, setEditedProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '', image: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading || checkingLogin) return <div className='flex justify-center'><span className="loading loading-bars loading-lg h-screen"></span></div>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  const handleEdit = (index: number) => {
    setEditing(true);
    setEditingIndex(index);
    setEditedProject({ ...data.projects[index] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setEditedProject({ ...editedProject, image: base64 });
    }
  };

  const handleSave = async () => {
    const updatedProjects = [...data.projects];
    updatedProjects[editingIndex!] = editedProject;

    const finalUpdatedProjects = updatedProjects.map(project => {
      if (project.image.startsWith("data:image")) {
        return {
          ...project,
          image: project.image.split("base64,")[1]
        };
      }
      return project;
    });

    await updateData({ projects: finalUpdatedProjects });
    if (!updateError) {
      window.location.reload(); // Refresh to show updated data
    }
    setEditing(false);
    setEditingIndex(null);
  };

  const handleAddProject = async () => {
    const finalProject = (() => {
      if (newProject.image.startsWith("data:image")) {
        return {
          ...newProject,
          image: newProject.image.split("base64,")[1]
        };
      } else {
        return newProject;
      }
    })();

    await addProject(finalProject);
    window.location.reload()
    if (!addError) {
      setNewProject({ title: '', description: '', link: '', image: '' });
    }

  };

  const openAddProject = () => {
    const modal = document.getElementById("addProject");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };


  const handleClose = () => {
    const modal = document.getElementById("addProject");
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
      if (!deleteError) {
        window.location.reload()
      }
    }
  };


  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  if ('projects' in data) {
    return (
      <section className="bg-black text-white pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Projects</h2>
          {isLoggedIn && (
            <button
              className="bg-purple-600 text-white btn btn-primary mb-4"
              onClick={openAddProject}
            >
              Add Project
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {data.projects.map((project, index) => (
              <div key={index} className="relative group w-full shadow-xl overflow-hidden rounded-lg">
                {editing && editingIndex === index ? (
                  <div className="p-4 bg-gray-800">
                    <input
                      name="title"
                      value={editedProject.title}
                      onChange={handleChange}
                      className="w-full mb-2 p-2 bg-gray-700 text-white"
                    />
                    <textarea
                      name="description"
                      value={editedProject.description}
                      onChange={handleChange}
                      className="w-full mb-2 p-2 bg-gray-700 text-white"
                    />
                    <input
                      name="link"
                      value={editedProject.link}
                      onChange={handleChange}
                      className="w-full mb-2 p-2 bg-gray-700 text-white"
                    />
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary mb-2"
                    >
                      Change Image
                    </button>
                    <button onClick={handleSave} className="btn btn-primary">Save</button>
                  </div>
                ) : (
                  <>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                      <h2 className="text-xl sm:text-2xl font-bold mb-2">{project.title}</h2>
                      <p className="mb-4 text-sm sm:text-base">{project.description}</p>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-secondary text-sm sm:text-base">Visit Site</a>
                      {isLoggedIn && (
                        <div className='flex space-x-4'>
                          <button onClick={() => handleEdit(index)} className="btn btn-primary mt-2">Edit</button>
                          {updateError && <p className="text-red-500 mt-4">{updateError}</p>}
                          <button onClick={() => handleDelete(project.title)} className="btn btn-error mt-2">Delete</button>
                        </div>
                      )}

                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <Modal id="addProject" title="Add Project" onClose={handleClose}>
          <div className="flex flex-col gap-2">
            <input
              name="title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Title"
              className="w-full p-2 bg-gray-700 text-white"
            />
            <textarea
              name="description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Description"
              className="w-full p-2 bg-gray-700 text-white"
            />
            <input
              name="link"
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              placeholder="Link"
              className="w-full p-2 bg-gray-700 text-white"
            />
            <input
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const base64 = await convertToBase64(file);
                  setNewProject({ ...newProject, image: base64 });
                }
              }}
              accept="image/*"
              className="w-full p-2 bg-gray-700 text-white"
            />
            <button onClick={handleAddProject} className="btn btn-primary">Add Project</button>
            {addError && <p className='text-red-700'>{addError}</p>}
          </div>
        </Modal>
      </section>
    );
  }
};

export default Projects;