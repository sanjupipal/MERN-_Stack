import Layout from '../../components/layout';
import WithAdmin from '../withAdmin'

const  Admin = ({user, token}) => <Layout>Hello Admin!! {JSON.stringify(user, token)}</Layout>

export default WithAdmin(Admin);