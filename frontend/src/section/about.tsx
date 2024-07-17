import React, { useState, useRef } from 'react';
import useFetchData from '../hooks/fetchData';
import useCheckLogin from '../hooks/fetchCheckLogin';
import useUpdateData from '../hooks/fetchUpdateData';

const About: React.FC = () => {
  const { data, loading, error } = useFetchData('about');
  const { updateData, updating, updateError } = useUpdateData('about');

  const [isEditing, setIsEditing] = useState(false);
  const { isLoggedIn, checkingLogin } = useCheckLogin();
  const [editedData, setEditedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading || checkingLogin) return <div className='flex justify-center'><span className="loading loading-bars loading-lg h-screen"></span></div>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...data });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setEditedData({ ...editedData, photo: base64 });
    }
  };

  const handleSave = async () => {
    const finalEdited = (() => {
      if (editedData.photo.startsWith("data:image")) {
        return {
          ...editedData,
          photo: editedData.photo.split("base64,")[1]
          // photo: null,
        };
      } else {
        return editedData;
      }
    })();
    // console.log(finalEdited);
    await updateData(finalEdited);
    if (!updateError) {
      setIsEditing(false);
      window.location.reload(); // Refresh to show updated data
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  if ('photo' in data) {
    return (
      <section className="bg-black text-white min-h-screen flex items-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">About Me</h2>
            {isLoggedIn && isEditing ? (
              <>
                <textarea
                  name="description"
                  value={editedData.description}
                  onChange={handleChange}
                  className="w-full p-2 mb-4 bg-gray-700 text-white"
                  rows={4}
                />
                <textarea
                  name="description2"
                  value={editedData.description2}
                  onChange={handleChange}
                  className="w-full p-2 mb-4 bg-gray-700 text-white"
                  rows={4}
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
                  className="btn btn-secondary mb-4"
                >
                  Choose New Photo
                </button>
                <button onClick={handleSave} className="btn btn-primary mr-2" disabled={updating}>
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
                {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
              </>
            ) : (
              <>
                <p className="text-lg">
                  {data.description}
                  <br /><br />
                  {data.description2}
                </p>
                {isLoggedIn && (
                  <button onClick={handleEdit} className="bg-purple-600 text-white btn btn-primary mt-4">Edit This Section</button>
                )}
              </>
            )}
          </div>
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img
              src={isEditing ? editedData.photo : data.photo}
              alt="Error loading photo"
              className="rounded-full w-64 h-64 object-cover"
            />
          </div>
        </div>
      </section>
    );
  }
};

export default About;