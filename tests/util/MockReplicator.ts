/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types, no-loop-func */
import MockInstance = jest.MockInstance;
import ArgsType = jest.ArgsType;
import Constructable = jest.Constructable;

type Callable = (...args: any[]) => any;

type MockFunction<FunctionType extends Callable> = MockInstance<ReturnType<FunctionType>, ArgsType<FunctionType>> & jest.Mock<any, any>;

export type Mock<T> = T & {
  [K in keyof T]: T[K] extends Callable ? MockFunction<T[K]> : T[K]
} & {
  mockClear: () => void;
  mockReset: () => void;
};

export default class MockReplicator {
  replicate<T extends Constructable>(objOrClass: T): Mock<InstanceType<T>>;
  replicate<T>(objOrClass: T): Mock<T>;
  replicate(objOrClass: any): any {
    if (typeof objOrClass === 'object') {
      return this.createMockObj(
        this.extractPublicMethodsFromObj(objOrClass),
        Object.getPrototypeOf(objOrClass),
      );
    }

    return this.createMockObj(
      this.extractPublicMethodsFromClass(objOrClass),
      objOrClass.prototype,
    );
  }

  private createMockObj(methods: Array<string>, prototype: Record<string, unknown>) {
    const mockObj: any = {};

    if (prototype) {
      Object.setPrototypeOf(mockObj, prototype);
    }

    for (const method of methods) {
      mockObj[method] = jest.fn();
    }

    mockObj.mockClear = () => {
      for (const method of methods) {
        mockObj[method].mockClear();
        delete mockObj[method].predefinedCalls;
      }
    };

    mockObj.mockReset = () => {
      for (const method of methods) {
        mockObj[method].mockReset();
        delete mockObj[method].predefinedCalls;
      }
    };

    return mockObj;
  }

  private extractPublicMethodsFromClass(Class: Constructable) {
    const allMethods = this.recursivelyExtractAllMethodsFromClass(Class);
    return this.filterOutNonAccessibleMethods(allMethods);
  }

  private recursivelyExtractAllMethodsFromClass(Class: Constructable, methods: Array<string> = []): Array<string> {
    const classMethods = Object.getOwnPropertyNames(Class.prototype);
    for (const method of classMethods) {
      if (!methods.includes(method) && this.isNotAccessor(Class, method)) {
        methods.push(method);
      }
    }

    const ClassPrototype = Object.getPrototypeOf(Class);
    if (ClassPrototype.prototype) {
      return this.recursivelyExtractAllMethodsFromClass(ClassPrototype, methods);
    }

    return methods ;
  }

  private filterOutNonAccessibleMethods(methods: Array<string>) {
    return methods
      .filter((method) => method !== 'constructor')
      .filter((method) => !method.startsWith('_'));
  }

  private extractPublicMethodsFromObj(obj: Record<string, unknown>) {
    const methods: Array<string> = [];
    let currentObj = obj;

    const methodsToSkip = [
      'constructor',
      '__defineGetter__',
      '__defineSetter__',
      'hasOwnProperty',
      '__lookupGetter__',
      '__lookupSetter__',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toString',
      'valueOf',
      'toLocaleString',
    ];

    do {
      Object.getOwnPropertyNames(currentObj).forEach((prop) => {
        if (
          typeof currentObj[prop] === 'function' &&
          !methods.includes(prop) &&
          !methodsToSkip.includes(prop)
        ) {
          methods.push(prop);
        }
      });
    } while ((currentObj = Object.getPrototypeOf(currentObj)));

    return methods;
  }

  private isNotAccessor<ClassType extends Constructable>(Class: ClassType, field: string) {
    const descriptor = Object.getOwnPropertyDescriptor(Class.prototype, field);

    if (descriptor) {
      return typeof descriptor.set === 'undefined' && typeof descriptor.get === 'undefined';
    }

    throw new Error(`Field ${field} is not present in ${Class.name} prototype`);
  }

}
