export declare abstract class IUserRepository {
    abstract save(user: any): Promise<any>;
    abstract update(user: any): Promise<any>;
    abstract findAll(): Promise<any>;
    abstract delete(id: string): Promise<any>;
    abstract findById(id: string): Promise<any>;
    abstract findByEmail(email: string): Promise<any>;
}
