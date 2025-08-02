import React, { useEffect } from 'react';
import useTvShowStore from '../store/useTvShowStore';
import ListCard from '../components/ListCard';
import { useTheme } from '../store/useThemeStore';  // useTheme import edildi

const TvShowsListPage = () => {
    const { tvShows, fetchTvShows, tvLoading, tverror } = useTvShowStore();
    const { lightMode } = useTheme();

    useEffect(() => {
        fetchTvShows();
    }, [fetchTvShows]);

    useEffect(() => {
        localStorage.setItem("lightMode", lightMode);
        if (lightMode) {
            document.documentElement.classList.remove("dark");
            document.body.style.backgroundColor = "#fef9f5";  // Açık mod arka planı
        } else {
            document.documentElement.classList.add("dark");
            // Dark modda arka plan rengini değiştirme, olduğu gibi bırak
            document.body.style.backgroundColor = ""; // Veya null, böylece önceki stil kalır
        }
    }, [lightMode]);

    if (tvLoading) return <div className="text-center mt-15">Loading...</div>;
    if (tverror) return <div className="text-center mt-10 text-red-500">{tverror}</div>;

    return (
        <div className={`p-6 flex flex-col items-center gap-6 ${lightMode ? "text-black" : "text-white"}`}>
            <h1 className="text-3xl font-bold mb-4">TvShows</h1>
            {tvShows.slice(0, 20).map((show) => (
                <ListCard key={show._id} movie={show} route="tvshow" />
            ))}
        </div>
    );
};

export default TvShowsListPage;
