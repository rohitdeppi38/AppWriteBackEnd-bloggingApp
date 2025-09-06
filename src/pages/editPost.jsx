import React from 'react'
import {Container, PostForm} from "../components"
import appwriteService from "../appwrite/config"
import { useParams ,useNavigate} from 'react-router-dom'

const EditPost = () => {
    const [posts,setPosts] = useState(null);
    const {slug} =useParams();
    const navigate = useNavigate()

    useEffect(()=>{
        if(slug){
            appwriteService.getPost(slug).then((post)=>{
                if(post){
                    setPosts(post)
                }
            })
        }else{
            navigate('/posts')
        }
    },[slug,navigate])
  return posts?(<div>
    <Container className="py-8">
        <PostForm post={posts}/>
    </Container>
  </div>):null
}

export default EditPost