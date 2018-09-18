import { create, destroy, update, replace, fetchAll, fetchOne } from 'utils/service';

export class BaseResourceClient {
  basePath: string;
  resourceName?: string;

  constructor(basePath: string, resourceName?: string) {
    this.basePath = basePath;
    this.resourceName = resourceName ? resourceName + ' ' : '';
  }

  fetchAll(query?, fields?) {
    return fetchAll(this.basePath,{
      query,
      fields,
      errorMessage: `Error fetching ${this.resourceName}list`,
    });
  }

  fetchOne(id: string) {
    return fetchOne(this.basePath, id, {
      errorMessage: `Error fetching ${this.resourceName}data`,
    });
  }

  create(data) {
    return create(this.basePath, data, {
      errorMessage: `Error creating ${this.resourceName}entry`,
    });
  }

  update(id: string, data) {
    return update(this.basePath, id, data, {
      errorMessage: `Error updating ${this.resourceName}entry`,
    });
  }

  replace(id: string, data) {
    return replace(this.basePath, id, data, {
      errorMessage: `Error replacing ${this.resourceName}entry`,
    });
  }

  delete(id: string) {
    return destroy(this.basePath, id, {
      errorMessage: `Error deleting ${this.resourceName}entry`,
    });
  }
}