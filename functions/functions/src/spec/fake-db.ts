import * as _ from 'lodash';
import * as mock from 'mock-require';

let _values;
reset();

export function reset() {
    _values = {};
}

export function has(path: string): boolean {
    return _values.hasOwnProperty(path);
}

export function get(path: string): Promise<string> {
    if (!(path in _values)) {
        return Promise.resolve(null);
    }
    return Promise.resolve(_values[path]);
}

export function set(path: string, value: any): Promise<void> {
    _values[path] = value;
    return Promise.resolve();
}

export function remove(path: string): Promise<void> {
    delete _values[path];
    return Promise.resolve();
}

export async function transaction(path: string, callback): Promise<any> {
    const data = path in _values ? _values[path] : null;
    const newData = await callback(data);
    _values[path] = newData;
    return Promise.resolve();
}

export function values() {
    return _values;
}

export function init(otherModule: string) {
    mock(otherModule, './fake-db');
}
