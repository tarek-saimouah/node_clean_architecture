export default interface ICacheRepo {
  setValue(
    key: string,
    value: string,
    expireIn?: number | string
  ): Promise<boolean>

  getValue<T>(key: string): Promise<T | null>

  deleteValue(key: string): Promise<boolean>
}
