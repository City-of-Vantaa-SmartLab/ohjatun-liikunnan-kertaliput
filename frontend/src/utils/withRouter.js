import { useLocation, useNavigate, useParams } from 'react-router-dom';

// HOC to provide router props to class components (React Router v6 compatible)
export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
                location={location}
                navigate={navigate}
                params={params}
            />
        );
    }

    return ComponentWithRouterProp;
}
