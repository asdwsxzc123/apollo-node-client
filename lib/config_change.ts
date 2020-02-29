import { PropertyChangeType } from './property_change_types';

export class ConfigChange<T> {
  constructor(
    private readonly namespaceName: string,
    private readonly propertyName: string,
    private readonly oldValue: void | T,
    private readonly newValue: void | T,
    private readonly changeType: PropertyChangeType,
  ) {
    this.namespaceName = namespaceName;
    this.propertyName = propertyName;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.changeType = changeType;
  }

  public getNamespace(): string {
    return this.namespaceName;
  }

  public getPropertyName(): string {
    return this.propertyName;
  }

  public getOldValue(): void | T {
    return this.oldValue;
  }

  public getNewValue(): void | T {
    return this.newValue;
  }

  public getChangeType(): PropertyChangeType {
    return this.changeType;
  }

}
