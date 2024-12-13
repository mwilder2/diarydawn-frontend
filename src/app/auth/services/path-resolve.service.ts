import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { paths } from '../../app-paths';

@Injectable({
  providedIn: 'root',
})
export class PathResolveService {
  paths = paths; // Example paths

  resolve(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string | null {
    const typoPath = state.url.replace('/', '');
    const threshold = this.getThreshold(typoPath);

    // Make sure paths are defined and filter them
    const dictionary = Object.values(this.paths || {}).filter(
      (path) => Math.abs(path.length - typoPath.length) < threshold
    );

    if (!dictionary.length) return null;
    this.sortByDistances(typoPath, dictionary);

    return `/${dictionary[0]}`;
  }


  // This method sorts the paths in the dictionary by their distance to the typoPath.
  sortByDistances(typoPath: string, dictionary: string[]) {
    const pathsDistance = {} as { [name: string]: number };

    dictionary.sort((a, b) => {
      if (!(a in pathsDistance)) {
        pathsDistance[a] = this.levenshtein(a, typoPath);
      }
      if (!(b in pathsDistance)) {
        pathsDistance[b] = this.levenshtein(b, typoPath);
      }

      return pathsDistance[a] - pathsDistance[b];
    });
  }

  // This method returns the threshold for the path.
  getThreshold(path: string): number {
    if (path.length < 5) return 3;

    return 5;
  }

  // This method computes the Levenshtein distance between two strings.
  levenshtein(a: string, b: string): number {
    if (a.length == 0) {
      return b.length;
    }
    if (b.length == 0) {
      return a.length;
    }

    // Create a matrix.
    const matrix = [];

    // Increment along the first column of each row.
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    // Increment each column in the first row.
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix.
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    // Return
    return matrix[b.length][a.length];
  }
}
