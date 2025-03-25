import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this?.query?.search;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        })),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['search', 'sortOrder', 'sortBy', 'limit', 'page', 'fields', 'isNewArrival', 'minPrice', 'maxPrice'];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.filter) {
      queryObj['author._id'] = queryObj.filter;
      delete queryObj.filter;
    }

    if (this.query.isNewArrival) {
      queryObj.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    if (this.query.minPrice || this.query.maxPrice) {
      queryObj.price = {} as Record<string, number>;
      if (this.query.minPrice) (queryObj.price as Record<string, number>).$gte = Number(this.query.minPrice);
      if (this.query.maxPrice) (queryObj.price as Record<string, number>).$lte = Number(this.query.maxPrice);
    }
    
    

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    const sortBy = (this?.query?.sortBy as string)?.split(',')?.join(' ') || 'createdAt';
    const sortOrder = this?.query?.sortOrder || 'desc';

    let sortQuery = sortOrder === 'desc' ? `-${sortBy}` : sortBy;

    if (this.query.isNewArrival) {
      sortQuery = '-createdAt';
    }

    this.modelQuery = this.modelQuery.sort(sortQuery);
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 6;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields = (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async getCountQuery() {
    return await this.modelQuery.clone().countDocuments();
  }

  getPaginationInfo() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    return { page, limit };
  }
}

export default QueryBuilder;
