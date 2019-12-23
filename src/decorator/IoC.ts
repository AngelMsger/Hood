/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { inject, injectable } from 'inversify';

export type MethodDescriptorValue = any;

/**
 * injectable components
 */
export const Service = injectable();
export const Dao = injectable();
export const Entity = injectable();

/**
 * injection
 */
export const Autowired = inject;
