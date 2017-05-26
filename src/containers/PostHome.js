import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPosts } from '../actions/index';
import PostListing from '../components/PostListing';

const mapStateToProps = state => ({
  posts: (
    state.posts.byListing.home &&
    state.posts.byListing.home.items &&
    state.posts.byListing.home.items.map(itemId => state.posts.byId[itemId])
    ) || []
});

const mapDispatchToProps = dispatch => ({
  fetchPosts: (params = {}) => {
    dispatch(fetchPosts({ listingName: 'home', ...params }));
  }
});

const PostHome = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PostListing));

export default PostHome;
