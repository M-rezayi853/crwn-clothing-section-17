import React, { useEffect, useRef, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CollectionsOverview from '../../components/collections-overview/collections-overview';
import CollectionPage from '../collection/collection';

import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';

import { updateCollections } from '../../redux/shop/shop.actions.js';

import WithSpinner from '../../components/with-spinner/with-spinner';


const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

const Shop = ({ match, updateCollections }) => {
    
    const [isLoading, setIsLoading] = useState(true);


    let unsubscribeFormSnapshot = useRef(null);

    useEffect(() => {
        const collectionRef = firestore.collection('collections');

        unsubscribeFormSnapshot.current = collectionRef.onSnapshot(async snapshot => {
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
            updateCollections(collectionsMap);

            setIsLoading(false);
        });
    }, [updateCollections]);

    return (
        <div className="shop-page">
            <Route 
                exact 
                path={`${match.path}`} 
                render={(props) => <CollectionsOverviewWithSpinner isLoading={isLoading} {...props} />} />
            <Route 
                path={`${match.path}/:collectionId`} 
                render={(props) => <CollectionPageWithSpinner isLoading={isLoading} {...props} /> } />
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    updateCollections: (collectionsMap) => dispatch(updateCollections(collectionsMap))
});


export default connect(null ,mapDispatchToProps)(Shop);