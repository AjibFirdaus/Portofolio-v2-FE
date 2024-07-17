/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import useFetchData from '../hooks/fetchData';
import useCheckLogin from '../hooks/fetchCheckLogin';
import useUpdateData from '../hooks/fetchUpdateData';

interface HomeProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  refs: {
    projectsRef: React.RefObject<HTMLDivElement>;
  };
}

const Home: React.FC<HomeProps> = ({ scrollToSection, refs }) => {
  const { data, loading, error } = useFetchData('home');
  const { isLoggedIn, checkingLogin } = useCheckLogin();
  const { updateData, updating, updateError } = useUpdateData('home');
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

  if (loading || checkingLogin) return <div className='flex justify-center'><span className="loading loading-bars loading-lg h-screen"></span></div>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  if ('name' in data) {
    const handleEdit = () => {
      setEditing(true);
      setEditedData({ ...data });
    };

    const handleSave = async () => {
      await updateData(editedData);
      setEditing(false);
      window.location.reload();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    return (
      <section className="bg-black text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {isLoggedIn && !editing && (
            <button onClick={handleEdit} className="bg-purple-600 text-white p-2 rounded mb-10 z-10">
            Edit This Section
          </button>
          )}
          {editing ? (
            <div className="flex flex-col space-y-4">
              <input
                name="name"
                value={editedData.name}
                onChange={handleChange}
                className="text-2xl md:text-4xl font-bold bg-gray-800 p-2 rounded w-full"
              />
              <textarea
                name="description"
                value={editedData.description}
                onChange={handleChange}
                className="text-base md:text-lg text-gray-500 w-full bg-gray-800 p-2 rounded"
                rows={3}
              />
              <textarea
                name="description2"
                value={editedData.description2}
                onChange={handleChange}
                className="text-base md:text-lg text-gray-500 w-full bg-gray-800 p-2 rounded"
                rows={3}
              />
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <input
                  name="link"
                  value={editedData.link}
                  onChange={handleChange}
                  className="text-purple-500 bg-gray-800 p-2 rounded flex-grow"
                  placeholder="Link"
                />
                <input
                  name="namaWebsite"
                  value={editedData.namaWebsite}
                  onChange={handleChange}
                  className="text-purple-500 bg-gray-800 p-2 rounded flex-grow"
                  placeholder="Website Name"
                />
              </div>
              <button onClick={handleSave} className="bg-purple-600 text-white p-2 rounded">
                Save
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-7">
                <span className="mr-2" role="img" aria-label="waving hand">👋 Hi, I'm {data.name}</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 mb-4 md:mb-6">{data.description}</p>
              <p className="text-base md:text-lg text-gray-500 mb-6 md:mb-8">
                {data.description2} <a href={data.link} className="text-purple-500">{data.namaWebsite}</a>
              </p>
            </>
          )}
          <button 
            className="bg-transparent border border-white text-white py-2 px-4 rounded-full hover:bg-white hover:text-black transition duration-300 w-full md:w-auto" 
            onClick={() => scrollToSection(refs.projectsRef)}
          >
            View My Projects <span className="ml-1">👈</span>
          </button>
        </div>
        {updateError && <p className="text-red-500 mt-4">{updateError}</p>}
        {updating && <p className="text-yellow-500 mt-4">Updating...</p>}
      </section>
    );
  }
};

export default Home;