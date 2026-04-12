/*
 * ============================================================
 *  DAA PROJECT — Design & Analysis of Algorithms
 *  Six Services, One System
 * ============================================================
 *
 *  LIBRARIES USED:
 *  - <iostream>   : for cin / cout (input/output)
 *  - <vector>     : for dynamic arrays
 *  - <string>     : for text data
 *  - <algorithm>  : for sort(), reverse(), max()
 *  - <climits>    : for INT_MAX (infinity placeholder)
 *
 *  ALGORITHMS INSIDE:
 *  1. NaviRoute   — Dijkstra's Shortest Path
 *  2. PackSort    — Merge Sort
 *  3. ZipIt       — Huffman Encoding (Greedy)
 *  4. DiffScan    — Longest Common Subsequence (DP)
 *  5. NetSpan     — Kruskal's MST (Greedy + Union-Find)
 *  6. ShiftBoard  — N-Queens via Backtracking
 * ============================================================
 */

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <climits>

using namespace std;


// ============================================================
//  SERVICE 1 — NaviRoute (Dijkstra's Shortest Path)
// ============================================================
/*
 *  ALGORITHM : Dijkstra's Algorithm
 *  TYPE      : Greedy
 *  PURPOSE   : Find the shortest path between two cities
 *
 *  HOW IT WORKS:
 *  - Start from source city with distance 0
 *  - At each step, pick the UNVISITED city with the SMALLEST known distance
 *  - Update distances to its neighbours if we found a shorter path
 *  - Repeat until destination is reached
 *
 *  WHY GREEDY? Because at every step we make the locally optimal choice
 *  (pick the closest unvisited city), and this leads to the global optimum.
 *
 *  TIME COMPLEXITY : O(V^2)  where V = number of cities
 *  SPACE COMPLEXITY: O(V + E) where E = number of roads
 */

// Maximum number of cities we support
const int MAX_CITIES = 20;

// Stores the road network as an adjacency matrix
// roadMap[i][j] = distance from city i to city j  (0 means no direct road)
int roadMap[MAX_CITIES][MAX_CITIES];
string cityNames[MAX_CITIES];
int cityCount = 0;

// Helper: find the index of a city name, or add it if new
int getCityIndex(const string& name) {
    for (int i = 0; i < cityCount; i++)
        if (cityNames[i] == name) return i;
    cityNames[cityCount] = name;
    return cityCount++;
}

// Add a bidirectional road between two cities
void addRoad(const string& u, const string& v, int dist) {
    int a = getCityIndex(u);
    int b = getCityIndex(v);
    roadMap[a][b] = dist;
    roadMap[b][a] = dist;
}

// Build the road network (hardcoded Indian cities)
void buildCityGraph() {
    // Zero out the map first
    for (int i = 0; i < MAX_CITIES; i++)
        for (int j = 0; j < MAX_CITIES; j++)
            roadMap[i][j] = 0;

    addRoad("Mumbai",    "Pune",      150);
    addRoad("Mumbai",    "Ahmedabad", 530);
    addRoad("Mumbai",    "Hyderabad", 710);
    addRoad("Delhi",     "Jaipur",    280);
    addRoad("Delhi",     "Bhopal",    740);
    addRoad("Delhi",     "Kolkata",  1470);
    addRoad("Jaipur",    "Ahmedabad", 660);
    addRoad("Jaipur",    "Bhopal",    580);
    addRoad("Bhopal",    "Hyderabad", 700);
    addRoad("Bhopal",    "Kolkata",  1060);
    addRoad("Hyderabad", "Bangalore", 570);
    addRoad("Hyderabad", "Chennai",   630);
    addRoad("Bangalore", "Chennai",   345);
    addRoad("Kolkata",   "Chennai",  1660);
    addRoad("Pune",      "Hyderabad", 560);
    addRoad("Ahmedabad", "Bhopal",    520);
}

// Core Dijkstra function
void demoNaviRoute() {
    cout << "\n=== NaviRoute: Dijkstra Shortest Path ===\n";

    buildCityGraph();

    int src = getCityIndex("Mumbai");
    int dst = getCityIndex("Delhi");

    // dist[i] = shortest known distance from src to city i
    int dist[MAX_CITIES];
    // parent[i] = which city we came from to reach city i on shortest path
    int parent[MAX_CITIES];
    // visited[i] = have we finalised the shortest path to city i?
    bool visited[MAX_CITIES];

    // Step 1: Initialise — all distances are "infinity", source is 0
    for (int i = 0; i < cityCount; i++) {
        dist[i]    = INT_MAX;
        parent[i]  = -1;
        visited[i] = false;
    }
    dist[src] = 0;

    // Step 2: Repeat cityCount times
    for (int step = 0; step < cityCount; step++) {

        // Step 2a: Pick the unvisited city with the smallest distance (Greedy choice)
        int u = -1;
        for (int i = 0; i < cityCount; i++) {
            if (!visited[i] && (u == -1 || dist[i] < dist[u]))
                u = i;
        }
        if (u == -1 || dist[u] == INT_MAX) break; // all reachable cities done

        visited[u] = true; // finalise this city

        // Step 2b: Relax edges — update neighbours if shorter path found
        for (int v = 0; v < cityCount; v++) {
            if (roadMap[u][v] > 0 && !visited[v]) { // there is a road u→v
                int newDist = dist[u] + roadMap[u][v];
                if (newDist < dist[v]) {
                    dist[v]   = newDist;  // shorter path found!
                    parent[v] = u;        // remember we came from u
                }
            }
        }
    }

    // Step 3: Reconstruct path by following parent pointers backwards
    vector<int> path;
    for (int cur = dst; cur != -1; cur = parent[cur])
        path.push_back(cur);
    reverse(path.begin(), path.end());

    // Print result
    cout << "Shortest Path: ";
    for (int i = 0; i < (int)path.size(); i++) {
        cout << cityNames[path[i]];
        if (i + 1 < (int)path.size()) cout << " -> ";
    }
    cout << "\nTotal Distance: " << dist[dst] << " km\n";
}


// ============================================================
//  SERVICE 2 — PackSort (Merge Sort)
// ============================================================
/*
 *  ALGORITHM : Merge Sort
 *  TYPE      : Divide and Conquer
 *  PURPOSE   : Sort delivery orders by value (cheapest to costliest)
 *
 *  HOW IT WORKS:
 *  - DIVIDE  : Split the array into two halves
 *  - CONQUER : Recursively sort each half
 *  - COMBINE : Merge the two sorted halves back together
 *
 *  KEY INSIGHT: Merging two SORTED arrays is easy and takes O(n) time.
 *  The recursion tree has log(n) levels, each doing O(n) work.
 *
 *  TIME COMPLEXITY : O(n log n) — guaranteed, even in worst case
 *  SPACE COMPLEXITY: O(n)       — extra temp array needed for merging
 */

struct Order {
    string id;
    string item;
    double weight;
    int value;
};

// Merge two sorted halves of 'orders' back into one sorted array
void merge(vector<Order>& orders, int left, int mid, int right) {
    // Copy both halves into temporary arrays
    vector<Order> leftHalf(orders.begin() + left,  orders.begin() + mid + 1);
    vector<Order> rightHalf(orders.begin() + mid + 1, orders.begin() + right + 1);

    int i = 0, j = 0, k = left;

    // Compare front of each half and pick the smaller one
    while (i < (int)leftHalf.size() && j < (int)rightHalf.size()) {
        if (leftHalf[i].value <= rightHalf[j].value)
            orders[k++] = leftHalf[i++];   // left side is smaller, take it
        else
            orders[k++] = rightHalf[j++];  // right side is smaller, take it
    }

    // Copy any remaining elements
    while (i < (int)leftHalf.size())  orders[k++] = leftHalf[i++];
    while (j < (int)rightHalf.size()) orders[k++] = rightHalf[j++];
}

// Recursively divide and sort
void mergeSort(vector<Order>& orders, int left, int right) {
    if (left >= right) return; // base case: single element, already sorted

    int mid = left + (right - left) / 2; // find middle (avoids overflow)

    mergeSort(orders, left, mid);         // sort left half
    mergeSort(orders, mid + 1, right);    // sort right half
    merge(orders, left, mid, right);      // merge both sorted halves
}

void demoPackSort() {
    cout << "\n=== PackSort: Merge Sort by Value ===\n";

    vector<Order> orders = {
        {"#A1042", "Laptop Pro",       2.1, 85000},
        {"#A1043", "Wireless Buds",    0.2,  3500},
        {"#A1044", "4K Monitor",       7.5, 32000},
        {"#A1045", "Keyboard",         0.8,  2800},
        {"#A1046", "Mechanical Watch", 0.1, 120000}
    };

    mergeSort(orders, 0, (int)orders.size() - 1);

    cout << "Sorted orders (cheapest to costliest):\n";
    for (const auto& o : orders)
        cout << o.id << " | " << o.item << " | Rs." << o.value << "\n";
}


// ============================================================
//  SERVICE 3 — ZipIt (Huffman Encoding)
// ============================================================
/*
 *  ALGORITHM : Huffman Coding
 *  TYPE      : Greedy
 *  PURPOSE   : Compress text by giving shorter codes to frequent characters
 *
 *  HOW IT WORKS:
 *  - Count frequency of each character
 *  - Build a binary tree (Huffman Tree):
 *      * Always merge the TWO LEAST FREQUENT nodes first (Greedy choice)
 *      * Left child = 0, Right child = 1
 *  - Read the code for each character by tracing from root to leaf
 *  - Frequent characters get SHORT codes, rare ones get LONG codes
 *
 *  WHY GREEDY? Merging least-frequent nodes first minimises total bit cost.
 *
 *  TIME COMPLEXITY : O(n log n) where n = number of unique characters
 *  SPACE COMPLEXITY: O(n)
 */

struct HuffNode {
    char ch;        // the character ('\0' if internal node)
    int freq;       // frequency of this character/subtree
    int left;       // index of left child  (-1 if none)
    int right;      // index of right child (-1 if none)
};

// Instead of a priority queue, we use a simple array and find min manually
// (avoids importing <queue>)
int findMin(const vector<HuffNode>& nodes, const vector<bool>& used) {
    int minIdx = -1;
    for (int i = 0; i < (int)nodes.size(); i++) {
        if (!used[i]) {
            if (minIdx == -1 || nodes[i].freq < nodes[minIdx].freq)
                minIdx = i;
        }
    }
    return minIdx;
}

// Recursively build Huffman codes
// 'code' accumulates the bit string as we go deeper into the tree
void buildCodes(const vector<HuffNode>& nodes, int idx, string code,
                vector<string>& codes) {
    if (idx == -1) return;

    // Leaf node — this is an actual character, save its code
    if (nodes[idx].left == -1 && nodes[idx].right == -1) {
        codes[(unsigned char)nodes[idx].ch] = code.empty() ? "0" : code;
        return;
    }

    buildCodes(nodes, nodes[idx].left,  code + "0", codes); // go left  → add 0
    buildCodes(nodes, nodes[idx].right, code + "1", codes); // go right → add 1
}

void demoZipIt() {
    cout << "\n=== ZipIt: Huffman Encoding ===\n";

    string text = "HELLO WORLD";

    // Step 1: Count frequency of each character
    int freq[256] = {0};
    for (char c : text) freq[(unsigned char)c]++;

    // Step 2: Create one leaf node per unique character
    vector<HuffNode> nodes;
    for (int i = 0; i < 256; i++) {
        if (freq[i] > 0)
            nodes.push_back({(char)i, freq[i], -1, -1});
    }

    // Step 3: Build the Huffman Tree by merging two smallest nodes repeatedly
    vector<bool> used(nodes.size(), false); // tracks which nodes are "in tree"

    int totalNodes = (int)nodes.size();
    for (int step = 0; step < totalNodes - 1; step++) {
        // Greedy: pick the two nodes with smallest frequency
        int a = findMin(nodes, used);
        used[a] = true;
        int b = findMin(nodes, used);
        used[b] = true;

        // Create a new internal node combining them
        HuffNode parent;
        parent.ch    = '\0';                       // internal node, no character
        parent.freq  = nodes[a].freq + nodes[b].freq;
        parent.left  = a;
        parent.right = b;

        nodes.push_back(parent);
        used.push_back(false); // this new node is still available
    }

    // The last node in the array is the root of the Huffman Tree
    int root = (int)nodes.size() - 1;

    // Step 4: Assign binary codes by traversing the tree
    vector<string> codes(256, "");
    buildCodes(nodes, root, "", codes);

    // Step 5: Encode the original text using these codes
    string encoded = "";
    for (char c : text) encoded += codes[(unsigned char)c];

    // Print results
    cout << "Original Bits : " << (int)text.size() * 8 << "\n";
    cout << "Compressed Bits: " << (int)encoded.size() << "\n";
    cout << "Encoded: " << encoded << "\n";
    cout << "Character Codes:\n";
    for (int i = 0; i < 256; i++) {
        if (!codes[i].empty())
            cout << "  '" << (char)i << "' (freq=" << freq[i] << ") -> " << codes[i] << "\n";
    }
}


// ============================================================
//  SERVICE 4 — DiffScan (Longest Common Subsequence)
// ============================================================
/*
 *  ALGORITHM : Longest Common Subsequence (LCS)
 *  TYPE      : Dynamic Programming
 *  PURPOSE   : Compare two versions of code and find what's common/changed
 *
 *  HOW IT WORKS:
 *  - Build a 2D table dp[i][j] = length of LCS of first i lines of A
 *    and first j lines of B
 *  - If A[i] == B[j] → dp[i][j] = dp[i-1][j-1] + 1  (extend LCS)
 *  - Else            → dp[i][j] = max(dp[i-1][j], dp[i][j-1])  (skip one)
 *  - Then backtrack through the table to find the actual common lines
 *
 *  WHY DP? Subproblems overlap — LCS(A[1..i], B[1..j]) reuses
 *  LCS(A[1..i-1], B[1..j-1]), so we store results to avoid recomputation.
 *
 *  TIME COMPLEXITY : O(m * n) where m, n = number of lines in each file
 *  SPACE COMPLEXITY: O(m * n) for the DP table
 */

void demoDiffScan() {
    cout << "\n=== DiffScan: Longest Common Subsequence ===\n";

    // Two versions of a function (line by line)
    vector<string> A = {
        "function authenticate(user, pass) {",
        "  const hash = md5(pass);",
        "  return true;",
        "}"
    };
    vector<string> B = {
        "async function authenticate(user, pass, mfa) {",
        "  const hash = bcrypt.hash(pass, 12);",
        "  return true;",
        "}"
    };

    int m = (int)A.size();
    int n = (int)B.size();

    // Step 1: Build the DP table
    // dp[i][j] = LCS length using first i lines of A and first j lines of B
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (A[i-1] == B[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;     // lines match: extend LCS
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]); // lines differ: take best
        }
    }

    // Step 2: Backtrack through dp to recover the actual common lines
    vector<string> common;
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (A[i-1] == B[j-1]) {
            common.push_back(A[i-1]); // this line is in the LCS
            i--; j--;
        } else if (dp[i-1][j] >= dp[i][j-1]) {
            i--; // move up (skip line from A)
        } else {
            j--; // move left (skip line from B)
        }
    }
    reverse(common.begin(), common.end()); // backtracking gives reverse order

    int lcsLen = dp[m][n];
    int adds   = n - lcsLen; // lines in B but not in LCS = additions
    int dels   = m - lcsLen; // lines in A but not in LCS = deletions
    int sim    = (m + n == 0) ? 100 : (2 * lcsLen * 100) / (m + n);

    cout << "LCS Length : " << lcsLen << "\n";
    cout << "Additions  : " << adds   << " lines\n";
    cout << "Deletions  : " << dels   << " lines\n";
    cout << "Similarity : " << sim    << "%\n";
    cout << "Common Lines:\n";
    for (const auto& line : common) cout << "  " << line << "\n";
}


// ============================================================
//  SERVICE 5 — NetSpan (Kruskal's MST)
// ============================================================
/*
 *  ALGORITHM : Kruskal's Algorithm (with Union-Find / Disjoint Set)
 *  TYPE      : Greedy
 *  PURPOSE   : Connect all offices with minimum total cable cost
 *
 *  HOW IT WORKS:
 *  - Sort all possible connections (edges) by cost (cheapest first)
 *  - Go through each edge:
 *      * If it connects two DIFFERENT components → include it (Greedy choice)
 *      * If it would create a CYCLE → skip it
 *  - Use Union-Find to efficiently check if two nodes are in the same component
 *
 *  UNION-FIND:
 *  - find(x)  : returns the "root" of x's component
 *  - union(a,b): merges the components of a and b
 *
 *  TIME COMPLEXITY : O(E log E) dominated by sorting edges
 *  SPACE COMPLEXITY: O(V)       for Union-Find arrays
 */

struct Edge {
    string u, v;
    int cost;
};

// Union-Find uses arrays for parent and rank
const int MAX_OFFICES = 10;
string officeNames[MAX_OFFICES];
int    ufParent[MAX_OFFICES]; // parent[i] = representative of i's component
int    ufRank[MAX_OFFICES];   // rank used for balanced merging
int    officeCount = 0;

int getOfficeIndex(const string& name) {
    for (int i = 0; i < officeCount; i++)
        if (officeNames[i] == name) return i;
    officeNames[officeCount] = name;
    ufParent[officeCount] = officeCount; // each node is its own parent initially
    ufRank[officeCount]   = 0;
    return officeCount++;
}

// Find root of x with path compression (makes future finds faster)
int ufFind(int x) {
    if (ufParent[x] != x)
        ufParent[x] = ufFind(ufParent[x]); // path compression
    return ufParent[x];
}

// Unite two components; returns false if they're already in the same one (cycle!)
bool ufUnite(int a, int b) {
    int pa = ufFind(a), pb = ufFind(b);
    if (pa == pb) return false; // same component → adding this edge makes a cycle

    // Union by rank: attach smaller tree under larger tree
    if (ufRank[pa] < ufRank[pb])       ufParent[pa] = pb;
    else if (ufRank[pa] > ufRank[pb])  ufParent[pb] = pa;
    else { ufParent[pb] = pa; ufRank[pa]++; }

    return true;
}

void demoNetSpan() {
    cout << "\n=== NetSpan: Kruskal's Minimum Spanning Tree ===\n";

    // List of all possible office connections with cost (in Lakhs)
    vector<Edge> edges = {
        {"HQ","DataCenter",12}, {"HQ","West",8},       {"HQ","CentralHub",10},
        {"DataCenter","North",6}, {"DataCenter","CentralHub",9}, {"DataCenter","East",15},
        {"North","East",7},     {"CentralHub","South",11}, {"CentralHub","East",13},
        {"West","South",14},    {"East","South",5}
    };

    // Register all office names in Union-Find
    string allOffices[] = {"HQ","DataCenter","North","East","South","West","CentralHub"};
    for (const auto& o : allOffices) getOfficeIndex(o);

    // Step 1: Sort edges by cost (cheapest first) — key Greedy step
    sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {
        return a.cost < b.cost;
    });

    // Step 2: Pick edges greedily, skip if they form a cycle
    vector<Edge> mst;
    int totalCost = 0;

    for (const auto& e : edges) {
        int a = getOfficeIndex(e.u);
        int b = getOfficeIndex(e.v);

        if (ufUnite(a, b)) {  // no cycle formed → include this edge
            mst.push_back(e);
            totalCost += e.cost;
        }
        // if ufUnite returns false → cycle → skip this edge
    }

    cout << "Minimum Spanning Network:\n";
    for (const auto& e : mst)
        cout << "  " << e.u << " -- " << e.v << " : " << e.cost << " Lakhs\n";
    cout << "Total Cost: " << totalCost << " Lakhs\n";
}


// ============================================================
//  SERVICE 6 — ShiftBoard (N-Queens via Backtracking)
// ============================================================
/*
 *  ALGORITHM : Backtracking
 *  TYPE      : Backtracking (exhaustive with pruning)
 *  PURPOSE   : Assign N staff members to N shifts with no conflicts
 *              (modelled as the classic N-Queens problem)
 *
 *  HOW IT WORKS:
 *  - Place one staff member per row (shift day)
 *  - Try each column (shift slot) for the current row
 *  - Check if placing here conflicts with anyone already placed:
 *      * Same column → conflict
 *      * Same diagonal → conflict (|row1-row2| == |col1-col2|)
 *  - If safe: place and recurse to next row
 *  - If stuck: BACKTRACK (undo last placement and try next column)
 *
 *  WHY BACKTRACKING? We explore the decision tree but prune branches
 *  early when a conflict is detected, avoiding redundant work.
 *
 *  TIME COMPLEXITY : O(N!) worst case (much better with pruning in practice)
 *  SPACE COMPLEXITY: O(N)  for the board array
 */

// Check if placing a queen at (row, col) conflicts with existing queens
bool isSafe(const vector<int>& board, int row, int col) {
    for (int i = 0; i < row; i++) {
        // Same column conflict
        if (board[i] == col) return false;
        // Diagonal conflict: difference in rows equals difference in columns
        if (abs(board[i] - col) == abs(i - row)) return false;
    }
    return true; // no conflicts
}

// Recursively try to place a queen in each row
bool solveNQueens(vector<int>& board, int row, int n) {
    if (row == n) return true; // all n queens placed successfully

    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col;                        // place queen
            if (solveNQueens(board, row + 1, n))     // recurse to next row
                return true;
            board[row] = -1;                         // BACKTRACK: undo placement
        }
    }
    return false; // no valid column found for this row
}

void demoShiftBoard() {
    cout << "\n=== ShiftBoard: N-Queens Backtracking ===\n";

    int n = 6; // 6 staff, 6 shifts
    vector<int> board(n, -1); // board[i] = shift slot assigned to staff i

    bool success = solveNQueens(board, 0, n);

    if (!success) {
        cout << "No valid schedule found.\n";
        return;
    }

    cout << "Staff Schedule (no two staff share same shift or conflict):\n";
    for (int i = 0; i < n; i++)
        cout << "  Staff " << i + 1 << " -> Shift Slot " << board[i] + 1 << "\n";
}


// ============================================================
//  MAIN — Run All Demos
// ============================================================

int main() {
    cout << "======================================\n";
    cout << "   DAA PROJECT — All Services Demo\n";
    cout << "======================================\n";

    demoNaviRoute();   // Dijkstra
    demoPackSort();    // Merge Sort
    demoZipIt();       // Huffman
    demoDiffScan();    // LCS / DP
    demoNetSpan();     // Kruskal's MST
    demoShiftBoard();  // Backtracking

    cout << "\n======================================\n";
    cout << "           All demos complete.\n";
    cout << "======================================\n";

    return 0;
}
