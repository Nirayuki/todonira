import '../styles/loading.css'

export const HomeLoadingSkeleton = () => {
    return (
        <div className="container-loading">
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}