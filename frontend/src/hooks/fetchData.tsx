import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

interface HomeData {
    name: string;
    description: string;
    description2: string;
    namaWebsite: string;
    link: string;
}

interface AboutData {
    photo: string; // URL to the photo
    description: string;
    description2: string;
}

interface ProjectData {
    projects: Array<{
        title: string;
        description: string;
        link: string;
        image: string; // URL to the image
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

type PageData = HomeData | AboutData | ProjectData | ContactData;

type PageType = 'home' | 'about' | 'projects' | 'contact';


const useFetchData = (page: PageType) => {
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Helper function to detect MIME type from base64 string
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
        return 'image/jpeg'; // default to JPEG if unknown
    };

    // Helper function to convert base64 to data URL
    const base64ToDataUrl = (base64String: string): string => {
        const mimeType = getMimeType(base64String);
        return `data:${mimeType};base64,${base64String}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<{ data: PageData }>(`${config}/api-select/${page}`);

                let processedData = response.data.data;
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

        fetchData();
    }, [page]);

    return { data, loading, error };
};

export default useFetchData;