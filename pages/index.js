import { gql, GraphQLClient } from 'graphql-request'
import NavBar from 'no/components/NavBar'
import Section from 'no/components/Section'
import Link from 'next/link'

export const getStaticProps = async () => {
  const url = process.env.END_POINT
  const client = new GraphQLClient(url, {
    headers: {
      "Authorization" : process.env.GRAPH_CMS_TOKEN
    }
  })
  const videosQuery = gql`
  query Videos {
    videos {
      createdAt
      description
      id
      publishedAt
      seen
      slug
      tags
      title
      updatedAt
      thumbnail {
        url
      }
      mp4 {
        url
      }
    }
  }
`
const accountQuery = gql`
    query {
    account(where: {id: "clfye73cjjgcg0bw7zwsv80hm"}) {
      username
      avatar {
        url
      }
    }
    }
`

  const data = await client.request(videosQuery)
  const videos = data.videos
  const accountData = await client.request(accountQuery)
  const account = accountData.account
  return {
    props: {
      videos,
      account
    }
  }
}


export default function Home({videos, account}) {

  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)]
  }

  const filterVideos = (videos, genere) => {
      return videos.filter((video) => video.tags.includes(genere))
  }

  const unSeenVideos = (videos) => {
    return videos.filter(video => video.seen == false || video.seen == null)
  }

  return (
    <div className='main'>
    <NavBar account={account} />
      <div className='app'>
        <div className='main-video'>
          <img src={randomVideo(videos).thumbnail.url} alt={randomVideo(videos).title}/>
        </div>
        <div className='video-feed'>
       <Link href="#disney"><div className='franchise' id='disney'></div></Link>
       <Link href="#pixar"><div className='franchise' id='pixar'></div></Link>
       <Link href="#thriller"><div className='franchise' id='thriller'></div></Link>
       <Link href="#marvel"><div className='franchise' id='marvel'></div></Link>
       </div>
        <Section genere={'Recomended for you'} videos={unSeenVideos(videos)} />
        <Section genere={'Family'} videos={filterVideos(videos, 'family')} />
        <Section id='thriller' genere={'Thriller'} videos={filterVideos(videos, 'thriller')} />
        <Section genere={'Nature'} videos={filterVideos(videos, 'nature')} />
        <Section id='marvel' genere={'Marvel'} videos={filterVideos(videos, 'marvel')} />
        <Section id='pixar' genere={'Pixar'} videos={filterVideos(videos, 'pixar')} />
        <Section id="disney" genere={'Classic'} videos={filterVideos(videos, 'classic')} />
        <Section genere={'Disney'} videos={filterVideos(videos, 'disney')} />
       
      </div>

    </div>
)}
