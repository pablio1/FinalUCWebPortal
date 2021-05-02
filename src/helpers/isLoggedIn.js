import store from 'store2';

export default () => !!store.get('token');
