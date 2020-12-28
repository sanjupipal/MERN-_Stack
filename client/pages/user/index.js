import Layout from '../../components/layout';
import axios from 'axios'
import { API } from '../../config'
import { getCookie } from '../../helpers/auth'
import withUser from '../withUser'

const  User = ({ user, token }) => <Layout>Hello User!! {JSON.stringify(user, token)}</Layout>

export default withUser(User);