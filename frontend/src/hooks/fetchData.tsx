
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import config from '../config/baseUrl';
import { useToast } from '../components/toastContext';

interface HomeData {
    name: string;
    description: string;
    description2: string;
    namaWebsite: string;
    link: string;
}

interface AboutData {
    photo: string;
    description: string;
    description2: string;
}

interface ProjectData {
    projects: Array<{
        title: string;
        description: string;
        link: string;
        image: string;
    }>;
}

interface ContactData {
    contactInformation: {
        email: string;
        telephone: string;
        location: string;
    };
    followMe: {
        X: string;
        github: string;
        instagram: string;
    };
}

interface MessagesData {
    id: string,
    sender: string,
    email: string,
    message: string,
}

type PageData = HomeData | AboutData | ProjectData | ContactData | MessagesData;

type PageType = 'home' | 'about' | 'projects' | 'contact' | 'messages';

const socket = io(config)

const useFetchData = (page: PageType) => {
    const { showToast } = useToast();
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getMimeType = (base64String: string): string => {
        const signatures: { [key: string]: string } = {
            '/9j/': 'image/jpeg',
            'iVBORw0KGgo': 'image/png',
            'R0lGODlh': 'image/gif',
            'UklGRg': 'image/webp',
        };
        for (const signature in signatures) {
            if (base64String.startsWith(signature)) {
                return signatures[signature];
            }
        }
        return 'image/jpeg';
    };

    const base64ToDataUrl = (base64String: string): string => {
        const mimeType = getMimeType(base64String);
        return `data:${mimeType};base64,${base64String}`;
    };

    const fetchData = async () => {
        try {
            const response = await axios.get<{ data: PageData }>(`${config}/api-select/${page}`);

            if (page === 'messages') {
                setData(response.data.data);
                setLoading(false);
                return;
            }

            const processedData = response.data.data;

            if ('photo' in processedData) {
                if (processedData.photo !== null) {
                    processedData.photo = base64ToDataUrl(processedData.photo);
                }
            }
            if ('projects' in processedData) {
                processedData.projects = processedData.projects.map(project => ({
                    ...project,
                    image: base64ToDataUrl(project.image)
                }));
            }

            setData(processedData);
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        socket.on('newProject', () => {
            showToast('New Project added!', 'success', 5000);
            fetchData();
        });

        socket.on('updateData', () => {
            showToast('a data has just been updated', 'success', 5000);
            fetchData();
        });

        socket.on('createMessage', () => {
            fetchData();
        });

        return () => {
            socket.off('newProject');
            socket.off('updateData');
            socket.off('createMessage');
        };
    }, [page]);

    return { data, loading, error };
};

export default useFetchData;