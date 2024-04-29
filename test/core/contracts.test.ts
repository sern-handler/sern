import { assertType, describe, it } from 'vitest';

import { __Services } from '../../src/core/structures';
import * as Contracts from '../../src/core/interfaces';

describe('default contracts', () => {
    it('should satisfy contracts', () => {
        assertType<Contracts.Logging>(new __Services.DefaultLogging());
        assertType<Contracts.ErrorHandling>(new __Services.DefaultErrorHandling());
    });
});
