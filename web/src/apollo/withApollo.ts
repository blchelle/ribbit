import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';
import { __NEXT_PUBLIC_API_URL__ } from '../constants';

// Configures the apollo client
const apolloClient = new ApolloClient({
	uri: __NEXT_PUBLIC_API_URL__,
	credentials: 'include',
	cache: new InMemoryCache(),
});

export const withApollo = createWithApollo(apolloClient);
