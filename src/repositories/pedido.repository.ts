import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Pedido, PedidoRelations, Personas, Producto} from '../models';
import {PersonasRepository} from './personas.repository';
import {ProductoRepository} from './producto.repository';

export class PedidoRepository extends DefaultCrudRepository<
  Pedido,
  typeof Pedido.prototype.id,
  PedidoRelations
> {

  public readonly personas: BelongsToAccessor<Personas, typeof Pedido.prototype.id>;

  public readonly producto: HasOneRepositoryFactory<Producto, typeof Pedido.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('PersonasRepository') protected personasRepositoryGetter: Getter<PersonasRepository>, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>,
  ) {
    super(Pedido, dataSource);
    this.producto = this.createHasOneRepositoryFactoryFor('producto', productoRepositoryGetter);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
    this.personas = this.createBelongsToAccessorFor('personas', personasRepositoryGetter,);
    this.registerInclusionResolver('personas', this.personas.inclusionResolver);
  }
}
