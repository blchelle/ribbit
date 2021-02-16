import React from 'react';
import { withApollo } from '../apollo/withApollo';

import NavBar from '../components/NavBar';

const Index = () => {
	return (
		<>
			<NavBar />
		</>
	);
};

export default withApollo({ ssr: true })(Index);
