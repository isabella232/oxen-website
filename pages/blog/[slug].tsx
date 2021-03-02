// [slug].js
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Article } from '../../components/article/Article';
import { CmsApi } from '../../services/cms';
import { PageType, setPageType, setPostTitle } from '../../state/navigation';
import { IPost } from '../../types/cms';
import { generateTitle } from '../../utils/metadata';

interface IPath {
  params: { slug: string };
}

export async function getStaticPaths() {
  const cms = new CmsApi();
  let posts: IPost[] = [];
  let page = 1;
  let foundAllPosts = false;

  // Contentful only allows 100 at a time
  while (!foundAllPosts) {
    const { posts: _posts } = await cms.fetchBlogEntries(100, page);

    if (_posts.length === 0) {
      foundAllPosts = true;
      continue;
    }

    posts = [...posts, ..._posts];
    page++;
  }

  const paths: IPath[] = posts.map(item => ({
    params: { slug: item.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  console.log(`Building page: %c${params.slug}`, 'color: purple;');

  const cms = new CmsApi();
  const post = await cms.fetchBlogBySlug(String(params?.slug) ?? '');

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}

// Parallax on bg as mouse moves
function Post({ post }: { post: IPost }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageType(PageType.POST));
    dispatch(setPostTitle(post.title));
  }, []);

  const pageTitle = generateTitle(post?.title);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta name="image_src" content={post?.featureImage?.imageUrl} />
        <meta name="image_url" content={post?.featureImage?.imageUrl} />
        <meta name="keywords" content={post?.tags?.join(' ')} />
        <meta
          property="og:image"
          content={post?.featureImage?.imageUrl}
          key="ogimage"
        />

        <meta property="og:site_name" content="oxen.io" key="ogsitename" />
        <meta property="og:title" content={pageTitle} key="ogtitle" />
        <meta
          property="og:description"
          content={post?.description}
          key="ogdesc"
        />
      </Head>

      <div className="bg-alt">
        <Article {...post} />
      </div>
    </>
  );
}

export default Post;
