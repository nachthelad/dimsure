# Firestore Indexes Configuration

## Overview
This document outlines the required Firestore composite indexes to optimize database queries and eliminate full collection scans.

## Required Composite Indexes

### Collection: `products`

#### 1. Status + CreatedAt Index
**Purpose**: Optimize recent products queries with status filtering
```
Collection ID: products
Fields:
  - status: Ascending
  - createdAt: Descending
```
**Query Pattern**: `where('status', '==', 'approved').orderBy('createdAt', 'desc')`
**Used In**: 
- Home page recent products
- Product listings
- Admin product management

#### 2. Status + Brand + CreatedAt Index  
**Purpose**: Filter products by status and brand, ordered by recency
```
Collection ID: products
Fields:
  - status: Ascending  
  - brand: Ascending
  - createdAt: Descending
```
**Query Pattern**: `where('status', '==', 'approved').where('brand', '==', brand).orderBy('createdAt', 'desc')`
**Used In**:
- Brand-specific product searches
- Product filtering by brand

#### 3. Status + Category + CreatedAt Index
**Purpose**: Filter products by status and category, ordered by recency  
```
Collection ID: products
Fields:
  - status: Ascending
  - category: Ascending  
  - createdAt: Descending
```
**Query Pattern**: `where('status', '==', 'approved').where('category', '==', category).orderBy('createdAt', 'desc')`
**Used In**:
- Category-based product searches
- Product filtering by category

#### 4. Status + Views + CreatedAt Index
**Purpose**: Popular products queries with status filtering
```
Collection ID: products  
Fields:
  - status: Ascending
  - views: Descending
  - createdAt: Descending
```
**Query Pattern**: `where('status', '==', 'approved').orderBy('views', 'desc').orderBy('createdAt', 'desc')`
**Used In**:
- Popular/trending products
- Most viewed products listings

#### 5. UserId + CreatedAt Index
**Purpose**: User's contributed products  
```
Collection ID: products
Fields:
  - userId: Ascending
  - createdAt: Descending
```
**Query Pattern**: `where('userId', '==', userId).orderBy('createdAt', 'desc')`
**Used In**:
- My contributions page
- User profile product listings

### Collection: `disputes`

#### 6. ProductId + Status + CreatedAt Index
**Purpose**: Product-specific disputes with status filtering
```
Collection ID: disputes  
Fields:
  - productId: Ascending
  - status: Ascending
  - createdAt: Descending
```
**Query Pattern**: `where('productId', '==', productId).where('status', '==', status).orderBy('createdAt', 'desc')`
**Used In**:
- Product dispute listings
- Admin dispute management

#### 7. Status + CreatedAt Index (Disputes)
**Purpose**: All disputes filtered by status
```
Collection ID: disputes
Fields:
  - status: Ascending  
  - createdAt: Descending
```
**Query Pattern**: `where('status', '==', status).orderBy('createdAt', 'desc')`
**Used In**:
- Admin dispute dashboard
- Dispute status filtering

### Collection: `blogPosts`

#### 8. Status + PublishedAt Index
**Purpose**: Published blog posts ordered by publish date
```
Collection ID: blogPosts
Fields:
  - status: Ascending
  - publishedAt: Descending  
```
**Query Pattern**: `where('status', '==', 'published').orderBy('publishedAt', 'desc')`
**Used In**:
- Blog listings
- Recent blog posts

### Collection: `guides`

#### 9. Status + UpdatedAt Index  
**Purpose**: Published guides ordered by last update
```
Collection ID: guides
Fields:
  - status: Ascending
  - updatedAt: Descending
```
**Query Pattern**: `where('status', '==', 'published').orderBy('updatedAt', 'desc')`
**Used In**:
- Guides listings
- Recently updated guides

## How to Create These Indexes

### Method 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database > Indexes
4. Click "Create Index"  
5. Enter the collection ID and field configurations as specified above
6. Click "Create"

### Method 2: Firebase CLI
```bash
# Deploy indexes from firestore.indexes.json
firebase deploy --only firestore:indexes
```

### Method 3: Auto-creation via Failed Queries
1. Run queries in your application
2. Firestore will show error messages with links to create required indexes
3. Click the provided links to auto-create indexes

## Verification

After creating indexes, verify they are working:

1. **Check Index Status**: Ensure all indexes show "Enabled" status in Firebase Console
2. **Monitor Query Performance**: Use Firebase Performance Monitoring
3. **Test Queries**: Run the query patterns listed above and verify they complete quickly

## Performance Impact

**Before Indexes**: 
- Full collection scans (expensive)
- Query timeouts on large datasets
- High Firestore read costs
- Slow page load times

**After Indexes**:
- Indexed queries (fast and efficient)  
- Predictable query performance
- Reduced Firestore costs
- Sub-second query responses

## Index Maintenance

- **Monitor Usage**: Regularly check index usage in Firebase Console
- **Remove Unused**: Delete indexes that are no longer needed  
- **Update as Needed**: Add new indexes when adding new query patterns
- **Size Monitoring**: Large indexes can impact write performance

## Estimated Impact

Creating these indexes should result in:
- **60-80% reduction** in query response times
- **40-60% reduction** in Firestore read costs  
- **Elimination** of full collection scans
- **Improved user experience** with faster page loads

---

**Created**: 2025-01-27  
**Status**: Required for production optimization
**Priority**: HIGH - Implement immediately after deployment