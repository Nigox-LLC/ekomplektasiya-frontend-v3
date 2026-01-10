

export const PlaceholderPage = ({ title }: { title: string }) => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
            <p>Bu sahifa ishlab chiqilmoqda...</p>
        </div>
    );
};
