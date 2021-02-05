import React from 'react';
import { withApollo } from '../apollo/withApollo';

import NavBar from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
	const { data } = usePostsQuery();

	return (
		<>
			<NavBar />
			{!data ? (
				<div>loading...</div>
			) : (
				data.posts.map((p) => <div key={p.id}>{p.title}</div>)
			)}
		</>
	);
};

export default withApollo({ ssr: true })(Index);
